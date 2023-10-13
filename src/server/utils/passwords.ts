import bcrypt from "bcrypt";

const sign = (plaintext: string) => bcrypt.hash(plaintext, 12);

const passwords_match = (plaintext: string, hashed: string) => bcrypt.compare(plaintext, hashed);

export default {
    sign,
    passwords_match,
};
