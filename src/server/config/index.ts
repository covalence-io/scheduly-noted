import dotenv from "dotenv";
dotenv.config();

const pg = {
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    host: process.env.DB_HOST as string,
    database: process.env.DB_DATABASE as string,
};
if (!pg.user || !pg.password || !pg.host || !pg.database) throw new Error("Missing Postgres Envars");

const jwt = {
    secret: process.env.JWT_KEY as string,
    expiration: process.env.JWT_EXPIRATION as string,
};

if (!jwt.secret || !jwt.expiration) throw new Error("Missing JWT Envars");

const mailgun = {
    to: process.env.MAILGUN_TO as string,
    domain: process.env.MAILGUN_DOMAIN as string,
    key: process.env.MAILGUN_API_KEY as string,
};
if (!mailgun.key || !mailgun.domain || !mailgun.to) throw new Error("Missing Mailgun Envars");

const domain = {
    base: process.env.DOMAIN_BASE as string,
};
if (!domain.base) throw new Error("Missing Domain Envars");

export default {
    pg,
    jwt,
    domain,
    mailgun,
};
