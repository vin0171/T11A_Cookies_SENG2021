import crypto from 'crypto';
import isEmail from 'validator/lib/isEmail.js';
import HTTPError from 'http-errors';
import { saveDataStore } from './dataStore';
import { Company, Invoice, User } from './interface';

export const SECRET = 'CookiesWillRuleTheWorld';
    

export const errorReturn = (status: number, error: string) => {
    saveDataStore();
    throw HTTPError(status, error);
};

export const getPasswordHash = (plaintext: string) => {
    return crypto.createHash('sha256').update(plaintext + SECRET).digest('hex');
};