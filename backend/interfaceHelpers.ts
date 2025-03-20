import {v4 as uuidv4} from 'uuid';
import { getData } from "./dataStore";
import * as helpers from './helper';
import * as validators from './validationHelpers';
import {Company, Gender, InvoiceDetails, InvoiceItem, Location, User } from './interface';
import { SECRET } from "./helper";
import jwt from 'jsonwebtoken';
import HTTPError from 'http-errors';

export async function createUser(email: string, password: string, nameFirst: string, nameLast: string, age: number) : Promise<User> {

    if (!validators.isValidName(nameFirst) || !validators.isValidName(nameLast)) {
		throw HTTPError(400, 'Error: Invalid Name');
	}

    const userExistsAlready = await getUserByEmail(email);
    if (userExistsAlready !== undefined) {
        throw HTTPError(400, 'Error: Email already used by another User');
    }

	if (!validators.isValidPass(password)) {
		throw HTTPError(400, 'Error: Invalid Password');
	}
    
    return {
        userId: uuidv4(),
        companyId: null,
        email: email,
        password: helpers.getPasswordHash(password),
        nameFirst: nameFirst,
        nameLast: nameLast,
        numSuccessfulLogins: 0,
        numFailedPasswordsSinceLastLogin: 0,
        age: age,
        gender: Gender.OTHER,
        timeCreated: new Date().toISOString(),
        previousPasswords: [],
        invoices: []
    }
}

// Acts as a .find function returning undefined if none found 
// else returns the user Object
export async function getUserByEmail(email: string) {
    if (!validators.isValidEmail(email)) {
		throw HTTPError(400, 'Error: Invalid Email');
	}

    const data = getData();
    const response = await data.query({
        TableName: "Users", 
        IndexName: "EmailIndex",
        KeyConditionExpression: 'email = :email', 
        ExpressionAttributeValues: {
            ':email': email
        }
    });

    return response.Items.length === 0 ? undefined : response.Items[0];
}

export function createToken(userId: string) : string {
    // the time created is called (iat), and its automatically included in the creation
    const data = { userId: userId }
    return jwt.sign(data, SECRET, {expiresIn: '7d'})
}

export function createCompany(companyName: string, companyAbn: string, headquarters: Location, companyEmail: string, contactNumber: string,
    userId: string): Company {

    if (!validators.isValidName(companyName)) {
        throw HTTPError(400, 'Error: Invalid Company Name');
    }
    if (!validators.isValidABN(companyAbn)) {
        throw HTTPError(400, 'Error: Invalid Company ABN');
    }
    if (!validators.isValidEmail(companyEmail)) {
        throw HTTPError(400, 'Error: Invalid Email');
    }
    if (!validators.isValidPhone(contactNumber)) {
        throw HTTPError(400, 'Error: Invalid Phone Number');
    }
    
    return {
        companyId: uuidv4(),
        name: companyName,
        abn: companyAbn,
        headquarters: headquarters,
        phone: contactNumber,
        email: companyEmail,
        owner: userId,
        admins: [userId],
        members: [userId],
        invoices: []
    }
    }
    
export async function getCompany(companyId: string) {
    const data = getData();
    const response = await data.get({ TableName: "Companies", Key: { companyId: companyId }});
    if (response.Item === undefined) {
        throw HTTPError(400, 'Error: Company does not exist');
    }
    return response.Item;
}

const validateInvoiceDetails = (invoiceDetails: InvoiceDetails) => {
    invoiceDetails.items.forEach((item: InvoiceItem) => {
        const fieldsToCheck: (keyof InvoiceItem)[] = [
            'quantity',
            'unitPrice',
            'discountAmount',
            'taxAmount',
            'taxRate',
            'totalAmount'
        ];

        fieldsToCheck.forEach((field: keyof InvoiceItem) => {
            if (typeof item[field] !== 'number') {
                throw HTTPError(400, `Invalid value for ${field}: ${item[field]} is not a number.`);
            }

            if (item[field] < 0) {
                throw HTTPError(400, `Invalid value for ${field}: ${item[field]} cannot be negative.`);
            }
        });
    });
};
    

export function generateInvoice(invoiceId: string, userId: string, companyId: string, invoiceDetails: InvoiceDetails) {
    validateInvoiceDetails(invoiceDetails);

    const invoice = {
        invoiceId: invoiceId, 
        userId: userId,
        companyId: companyId,
        details: invoiceDetails
    }

    return invoice;
}

export async function getInvoice(invoiceId: string) {
    const data = getData();
    const response = await data.get({ TableName: "Invoices", Key: { invoiceId: invoiceId }});
    if (response.Item === undefined) {
        throw HTTPError(400, 'Error: Invoice does not exist');
    }
    return response.Item;
}