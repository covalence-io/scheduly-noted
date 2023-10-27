import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import db from "../db";
import config from "../config";
import validators from "../utils/validators";
import type { User } from "../types";
import { sendVerificationEmail } from "../services/mailer";

const change_mfa: RequestHandler = async (req, res, next) => {
    const { preference } = req.body as { preference: User["mfa_preference"] };
    const { id, email_verified, phone_verified } = req.user;

    if (!validators.isString(preference) || !["email", "none", "phone"].includes(preference)) {
        return res.status(400).json({ message: "Missing preference value or preference value may not be filled out." });
    }

    try {
        if (preference === "phone" && !phone_verified) {
            // ! TODO: Send SMS to verify phone
            return res.status(400).json({
                message:
                    "Cannot change MFA preference to SMS without verifying your phone, please check your phone for a new code to verify.",
            });
        }
        if (preference === "email" && !email_verified) {
            // ! TODO: Send SMS to verify phone
            return res.status(400).json({
                message:
                    "Cannot change MFA preference to email without verifying your email, please check your inbox for a new code to verify.",
            });
        }

        await db.users.update_mfa(preference, id);
        res.status(200).json({ message: "Successfully updated your MFA status to " + preference });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Could not change MFA preference at this time" });
    }
};

const verify: RequestHandler = async (req, res, next) => {
    const type = req.query.type;
    const token = req.query.token;

    if (!token || !type || typeof token !== "string" || typeof type !== "string") {
        return res.status(401).json({ message: "Missing auth information" });
    }

    try {
        const { email } = jwt.verify(token, config.jwt.secret) as { email: string };
        await db.users.verify(email);
        res.status(200).json({ message: "Awww yiss, nicely done mate" });
    } catch (error) {
        const { email } = jwt.decode(token) as { email: string };
        await sendVerificationEmail(email);
        res.status(401).json({ message: "Invalid token, please check your email for a new link." });
    }
};

export default {
    change_mfa,
    verify,
};
