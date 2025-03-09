import isEmail from "validator/lib/isEmail";
import * as helpers from "./helper";
import { Invoice, Location, User } from "./interface";
import { getData } from "./dataStore";
import { Address } from "cluster";
import { getUser } from "./interfaceHelpers";
import { Session } from "inspector/promises";
let jwt = require('jsonwebtoken')

// isValid{name} to validate generic types::: Return True or False
// validate{name} to validate specific types from interface.ts::: Return the object or throws an error

export const validateToken = (token: string) : User => {
    try {
        const dataStore = getData();
        const currentToken= jwt.verify(token, helpers.SECRET);
        const user = dataStore.users.find((user) => user.userId === currentToken.userId);
        return user
    } catch(err) {
        if (err.name === 'TokenExpiredError') {
            throw helpers.errorReturn(401, 'Error: Token has expired - Please log in again');
        } else if (err.name === 'NotBeforeError') {
            throw helpers.errorReturn(401, 'Error: Token is not active');
        } else {
            throw helpers.errorReturn(401, 'Error: Invalid Token');
        }
    }
}

export function isValidName(name: string) : boolean {
    const MIN_NAME_LEN = 2;
    const MAX_NAME_LEN = 20;
    const ALLOWED_CHARS = /[^a-zA-Z '-]/;

    if (name.length < MIN_NAME_LEN || name.length > MAX_NAME_LEN) {
        return false;
    }

    if (ALLOWED_CHARS.test(name)) {
        return false;
    }

    return true;
}

export function isValidEmail(email: string): boolean {
    if (!isEmail(email)) {
        return false;
    }
    return true;
}

export function isValidPass(password: string): boolean {
    const MIN_PASSWORD_LEN = 8;
    const LOWERCASE_LETTERS = /[a-z]/;
    const UPPERCASE_LETTERS = /[A-Z]/;
    const NUMBERS = /[0-9]/;

    if (password.length < MIN_PASSWORD_LEN) {
        return false;
    }

    if (((LOWERCASE_LETTERS.test(password) || UPPERCASE_LETTERS.test(password)) &&
        NUMBERS.test(password)) === false) {
        return false;
    }

    return true;
};


export function authenticateUser(email: string, password: string) : User {
    const dataStore = getData();
    if (!isValidEmail(email)) {
        throw helpers.errorReturn(400, 'Error: Invalid Email');
    }

    const user = dataStore.users.find((object) => object.email === email);
    if (user === undefined) {
        throw helpers.errorReturn(400, 'Error: Email does not exist');
    }

    if (user.password !== helpers.getPasswordHash(password)) {
        user.numFailedPasswordsSinceLastLogin++;
        throw helpers.errorReturn(400, 'Error: Incorrect Password');
    }

    return user;
}

export function isValidABN(abn: string): boolean {
    const ABN_REGEX = /^\d{11}$/;
    if (!ABN_REGEX.test(abn)) {
        return false;
    }

    return true;
}

export function validateLocation(address: string, city: string, state: string, postcode: string, country: string): Location {
    
    if (!isValidName(address)) {
        throw helpers.errorReturn(400, 'Error: Invalid Address');
    }
    if (!isValidName(city)) {
        throw helpers.errorReturn(400, 'Error: Invalid City');
    }
    if (!isValidName(state)) {
        throw helpers.errorReturn(400, 'Error: Invalid State');
    }
    if (!isValidName(postcode)) {
        throw helpers.errorReturn(400, 'Error: Invalid Postcode');
    }
    if (!isValidName(country)) {
        throw helpers.errorReturn(400, 'Error: Invalid Country');
    }

    return {
        address: address,
        city: city,
        state: state,
        postcode: postcode,
        country: country,
    }   
}


export function isValidPhone(phone: string): boolean {
    const PHONE_REGEX = /^\d{10}$/;
    if (!PHONE_REGEX.test(phone)) {
        return false;
    }

    return true;
}

export function validateUsersAccessToInvoice(user: User, invoiceId: string): Invoice {
    const dataStore = getData();
    const invoice = dataStore.invoices.find((object) => object.invoiceId === invoiceId);
    if (invoice === undefined) {
        throw helpers.errorReturn(400, 'Error: Invoice does not exist');
    }
    if (invoice.companyOwnerId !== user.companyId) {
        throw helpers.errorReturn(400, 'Error: User does not have access to this invoice');
    }

    // Check Access Rights when implemented

    return invoice;
}
