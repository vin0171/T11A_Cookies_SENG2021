import crypto from 'crypto';

export const SECRET = 'CookiesWillRuleTheWorld';

export const getPasswordHash = (plaintext: string) => {
    return crypto.createHash('sha256').update(plaintext + SECRET).digest('hex');
};