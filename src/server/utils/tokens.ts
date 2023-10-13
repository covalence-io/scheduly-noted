import jwt from "jsonwebtoken";
import config from "../config";
import { Payload } from "../types";

const sign = (payload: Payload) => {
    if (!config.jwt.secret) throw new Error("AWWW NO UNHANDLED ERROR Y'ALL, MISSING JWT SECRET");

    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiration });
};

const verify = (token: string) => {
    if (!config.jwt.secret) throw new Error("AWWW NO UNHANDLED ERROR Y'ALL, MISSING JWT SECRET");

    return jwt.verify(token, config.jwt.secret) as Payload;
};

export default {
    sign,
    verify,
};
