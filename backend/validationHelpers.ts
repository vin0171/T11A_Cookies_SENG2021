import isEmail from "validator/lib/isEmail";
import * as helpers from "./helper";
import { Location } from "./interface";
import { getData } from "./dataStore";
import jwt, { JwtPayload } from 'jsonwebtoken'
import HTTPError from 'http-errors';
import { getCompany, getInvoice, getUserByEmail, getUserByEmailV3 } from "./interfaceHelpers";

export const validateToken = async (token: string) => {
    try {
        const data = getData();
        const currentToken = jwt.verify(token, helpers.SECRET) as JwtPayload;
        const response = await data.get({TableName: "Users", Key: { userId: currentToken.userId }});
        // TODO: handle case where undefined throw error of response?
        const user = response.Item;
        return user;
    } catch(err) {
        if (err.name === 'TokenExpiredError') {
            throw HTTPError(401, 'Error: Token has expired - Please log in again');
        } else if (err.name === 'NotBeforeError') {
            throw HTTPError(401, 'Error: Token is not active');
        } else {
            throw HTTPError(401, 'Error: Invalid Token');
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

// ! DEPRECATED
export async function authenticateUser(email: string, password: string) {
    const data = getData();

    const user = await getUserByEmail(email);

    if (user === undefined) {
        throw HTTPError(400, 'Error: User with this email does not exist');
    }

    // TODO: Maybe chuck it in another function the update
    if (user.password && user.password !== helpers.getPasswordHash(password)) {
        const userFails = user.numFailedPasswordsSinceLastLogin + 1;
        const updateExpression = 'SET numFailedPasswordsSinceLastLogin = :fails'
        await data.update({
            TableName: "Users", 
            Key: { userId: user.userId },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: { ':fails': userFails },
        });
        throw HTTPError(400, 'Error: Incorrect Password');
    }

    return user;
}

export async function authenticateUserV3(email: string, password: string) {
    const user = await getUserByEmailV3(email);

    if (user === undefined) {
        throw HTTPError(400, 'Error: User with this email does not exist');
    }

    if (user.password && user.password !== helpers.getPasswordHash(password)) {
        throw HTTPError(400, 'Error: Incorrect Password');
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

export function isValidPhone(phone: string): boolean {
    // TODO: This needs a lot of work
    const PHONE_REGEX = /^\d{10}$/;
    if (!PHONE_REGEX.test(phone)) {
        return false;
    }

    return true;
}

export function validateLocation(address: string, city: string, state: string, postcode: string, country: string): Location {
    
    // if (!isValidName(address)) {
    //     throw HTTPError(400, 'Error: Invalid Address');
    // }
    if (!isValidName(city)) {
        throw HTTPError(400, 'Error: Invalid City');
    }
    if (!isValidName(state)) {
        throw HTTPError(400, 'Error: Invalid State');
    }
    // if (!isValidName(postcode)) {
    //     throw HTTPError(400, 'Error: Invalid Postcode');
    // }
    if (!isValidName(country)) {
        throw HTTPError(400, 'Error: Invalid Country');
    }

    return {
        address: address,
        city: city,
        state: state,
        postcode: postcode,
        country: country,
    }   
}

// This function is for people who are members of a company but not an admin,
// they can only create and read invoices.
export async function validateUsersPerms(userId: string, userCompanyId: string, invoiceId: string) {
    const invoice = await getInvoice(invoiceId);
    if (!invoice) {
        throw HTTPError(403, 'Error: Invoice does not exist');
    }

    // Check if the invoice is not a company invoice and it wasn't made by the current user
    // or check if the invoice is a company invoice and if the current user belongs to that company.
    if ((!invoice.companyId && invoice.userId != userId) || (invoice.companyId && invoice.companyId != userCompanyId)) {
        throw HTTPError(403, 'Error: User does not have access to this invoice');
    }

    return invoice;
}

export async function validateAdminPerms(userId: string, userCompanyId: string, invoiceId: string) {
    const invoice = await validateUsersPerms(userId, userCompanyId, invoiceId)
    const company = await getCompany(userCompanyId);

    if (!company.admins.includes(userId)) {
        throw HTTPError(403, 'Error: User is not an admin');
    }
    return invoice
}
