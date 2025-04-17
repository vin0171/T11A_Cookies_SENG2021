import {v4 as uuidv4} from 'uuid';
import { getData } from "./dataStore";
import * as helpers from './helper';
import * as validators from './validationHelpers';
import {Address, Company, Gender, Invoice, InvoiceDetails, InvoiceDetailsV2, InvoiceItem, InvoiceItemV2, InvoiceV2, Item, Location, OldCompany, OldUser, ParticipantV2, User } from './interface';
import { SECRET } from "./helper";
import jwt from 'jsonwebtoken';
import HTTPError from 'http-errors';


// ! DEPRECATED
export async function createUser(email: string, password: string, nameFirst: string, nameLast: string, age: number) : Promise<OldUser> {

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


export async function createUserV3(email: string, password: string, nameFirst: string, nameLast: string) : Promise<User> {

    if (!validators.isValidName(nameFirst) || !validators.isValidName(nameLast)) {
		throw HTTPError(400, 'Error: Invalid Name');
	}

    const userExistsAlready = await getUserByEmailV3(email);
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
        timeCreated: new Date().toISOString(),
    }
}


// Acts as a .find function returning undefined if none found 
// else returns the user Object

// ! DEPRECATED
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

export async function getUserByEmailV3(email: string) {
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

// ! DEPRECATED
export function createCompany(companyName: string, companyAbn: string, headquarters: Location, companyEmail: string, contactNumber: string,
    userId: string): OldCompany {

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
        invoices: [],
        // // GONNA MAYBE BREAK OLD STUFF
        // customers: [],
        // items: []
    }
}

export function createCompanyV3(companyName: string, companyAbn: string, headquarters: Location, companyEmail: string, contactNumber: string,
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
        invoices: [],
        customers: [],
        items: []
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

const validateInvoiceDetailsV2 = (invoiceDetails: InvoiceDetailsV2) => {
    invoiceDetails.items.forEach((item: InvoiceItemV2) => {
        const fieldsToCheck: (keyof InvoiceItemV2)[] = [
            'quantity',
            'discountAmount',
            'totalAmount'
        ];

        fieldsToCheck.forEach((field: keyof InvoiceItemV2) => {
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


export function generateInvoiceV2(invoiceId: string, userId: string, companyId: string, invoiceDetails: InvoiceDetailsV2, isDraft: boolean) {
    if (!isDraft) {
        validateInvoiceDetailsV2(invoiceDetails);
    }
    const invoice: InvoiceV2 = {
        invoiceId: invoiceId, 
        userId: userId,
        companyId: companyId,
        details: invoiceDetails,
        isDraft: isDraft,
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


export async function createCustomerV3(name: string, billingAddress: Address, shippingAddress: Address, email: string, bankName: string, bankAccount: string) : Promise<ParticipantV2> {
    if (!validators.isValidName(name)) {
		throw HTTPError(400, 'Error: Invalid Name');
	}

    if (!validators.isValidEmail(email)) {
        throw HTTPError(400, 'Error: Invalid Email');
    }

    const customerExistsAlready: ParticipantV2 = await getCustomerByEmailV3(email);
    if (customerExistsAlready !== undefined) {
        return customerExistsAlready;
    }

    return {
        customerId: uuidv4(),
        name: name,
        billingAddress: billingAddress,
        shippingAddress: shippingAddress,
        email: email,
        bankName: bankName,
        bankAccount: bankAccount
    }
}

export async function getCustomer(customerId: string) {
    const data = getData();
    const response = await data.get({ TableName: "Customers", Key: { customerId: customerId }});
    if (response.Item === undefined) {
        throw HTTPError(400, 'Error: Customers does not exist');
    }
    return response.Item;
}

export async function getCustomerByEmailV3(email: string): Promise<ParticipantV2 | undefined> {
    if (!validators.isValidEmail(email)) {
		throw HTTPError(400, 'Error: Invalid Email');
	}

    const data = getData();
    const response = await data.query({
        TableName: "Customers", 
        IndexName: "EmailIndex",
        KeyConditionExpression: 'email = :email', 
        ExpressionAttributeValues: {
            ':email': email
        }
    });

    return response.Items.length === 0 ? undefined : response.Items[0] as ParticipantV2;
}


export async function createItemV3(name: string, sku: string, description: string, unitPrice: string) {
    if (!validators.isValidName(name)) {
        throw HTTPError(400, 'Error: Invalid Name');
    }

    const itemExistsAlready = await getItemBySkuV3(sku);
    if (itemExistsAlready !== undefined) {
        throw HTTPError(400, 'Error: Item already exists');
    }

    return {
        itemId: uuidv4(),
        name: name,
        sku: sku,
        description: description,
        unitPrice: unitPrice
    }
}

export async function getItem(itemId: string) {
    const data = getData();
    const response = await data.get({ TableName: "Items", Key: { itemId: itemId }});
    if (response.Item === undefined) {
        throw HTTPError(400, 'Error: Item does not exist');
    }
    return response.Item;
}

export async function getItemBySkuV3(sku: string) {

    const data = getData();
    const response = await data.query({
        TableName: "Items", 
        IndexName: "SkuIndex",
        KeyConditionExpression: 'sku = :sku', 
        ExpressionAttributeValues: {
            ':email': sku
        }
    });

    return response.Items.length === 0 ? undefined : response.Items[0];
}
