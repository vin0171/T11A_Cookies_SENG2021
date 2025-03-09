import crypto from 'crypto';
import HTTPError from 'http-errors';
import { saveDataStore } from './dataStore';

export const SECRET = 'CookiesWillRuleTheWorld';
    

export const errorReturn = (status: number, error: string) => {
    saveDataStore();
    throw HTTPError(status, error);
};

export const getPasswordHash = (plaintext: string) => {
    return crypto.createHash('sha256').update(plaintext + SECRET).digest('hex');
};