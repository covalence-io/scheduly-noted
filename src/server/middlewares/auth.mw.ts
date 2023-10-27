import bcrypt from "bcrypt";
import db from "../db";
import utils from "../utils";
import validators from "../utils/validators";
import { BaseUser } from "../types";
import type { RequestHandler } from "express";
import { sendVerificationEmail } from "../services/mailer";

const register: RequestHandler = async (req, res, next) => {
    const { name, email, password, username, phone } = req.body;

    const { hasBadValues, badVals } = validators.stringsAreGood([name, email, password, username, phone]);

    if (hasBadValues) {
        return res.status(400).json({ message: "Missing some values or some values may not be filled out.", badVals });
    }

    const newUser: BaseUser = { name, email, password, username, phone };
    try {
        newUser.password = await bcrypt.hash(password, 12);
        const { rows } = await db.users.create(newUser);
        const id = rows[0].id;

        await sendVerificationEmail(email);

        res.status(201).json({ message: "Successfully created account!", id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Could not register user account at this time" });
    }
};

const login: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || typeof email !== "string" || !password)
        return res.status(400).json({ message: "Must have both email (or username) and password" });

    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    const isEmail = email.match(emailPattern);

    try {
        console.log(isEmail);
        const [user] = await db.users.find_by(isEmail ? "email" : "username", email);
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const passwords_match = await utils.passwords.passwords_match(password, user.password);
        if (!passwords_match) return res.status(401).json({ message: "Invalid credentials" });

        if (!user.email_verified) {
            await sendVerificationEmail(email);
            return res.status(403).json({
                message:
                    "You must verify your email before logging in, please check your inbox for a new email (code will expire in 10 minutes)",
            });
        } else {
            const { id, email, username, name, email_verified, phone_verified } = user;
            const token = utils.tokens.sign({ id, email, username, name, email_verified, phone_verified });
            res.status(200).json({ message: "Gratz, buddy, you logged in!", token });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Could not login at this time, please try again later" });
    }
};

const token_check: RequestHandler = async (req, res, next) => {
    const authHeaders = req.headers.authorization;

    if (!authHeaders) return res.status(401).json({ message: "Missing auth headers" });

    const [type, token] = authHeaders.split(" ");

    if (!type || !token || type.toLowerCase() !== "bearer")
        return res.status(401).json({ message: "Invalid auth header" });

    try {
        const payload = utils.tokens.verify(token);
        req.user = payload;
        next();
    } catch (error) {
        const err = error as Error;
        console.log(error);
        res.status(401).json({ message: "Unable to verify token - " + err.message });
    }
};

export default {
    register,
    login,
    token_check,
};
