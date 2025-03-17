import {v4 as uuidv4} from 'uuid';
import { getData } from "./dataStore";
import * as helpers from './helper';
import * as validators from './validationHelpers';
import {Company, Gender, InvoiceDetails, Location, User, UserOptions} from './interface';
import { SECRET } from "./helper";
import jwt from 'jsonwebtoken';

export function createUser(email: string, password: string, nameFirst: string, nameLast: string, age: number) : User {
    const dataStore = getData();

    if (!validators.isValidName(nameFirst) || !validators.isValidName(nameLast)) {
		throw helpers.errorReturn(400, 'Error: Invalid Name');
	}

	if (!validators.isValidEmail(email)) {
		throw helpers.errorReturn(400, 'Error: Invalid Email');
	}
	
	if (dataStore.users.find((object) => object.email === email) !== undefined) {
		throw helpers.errorReturn(400, 'Error: Email already used by another User');
	}

	if (!validators.isValidPass(password)) {
		throw helpers.errorReturn(400, 'Error: Invalid Password');
	}
    
    return {
        token: null,
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
        timeCreated: new Date(),
        previousPasswords: [],
        invoices: []
    }
}

export function getUser({userId, email}: UserOptions) : User {
    const dataStore = getData();
    if (!userId && !email) {
        throw helpers.errorReturn(400, 'Error: Provide either a user ID or an email')
    }

    if (email !== undefined) {
        if (!validators.isValidEmail(email)) {
            throw helpers.errorReturn(400, 'Error: Invalid Email');
        }
        const user = dataStore.users.find((object) => object.email === email);
        if (user === undefined) {
            throw helpers.errorReturn(400, 'Error: Email does not exist');
        }
        return user;
    }

    const user = dataStore.users.find((object) => object.userId === userId);
    if (user === undefined) {
        throw helpers.errorReturn(400, 'Error: User does not exist');
    }
    return user;
}

export function validateUser() : boolean {
    return true
}

export function createToken(user: User) : string {
    // the time created is called (iat), and its automatically included in the creation
    const data = {
        userId: user.userId,
    }
    return jwt.sign(data, SECRET, {expiresIn: '7d'})
}

export function createCompany(companyName: string, companyAbn: string, headquarters: Location, companyEmail: string, contactNumber: string,
    user: User): Company {
      // check if the company name is valid
    if (!validators.isValidName(companyName)) {
        throw helpers.errorReturn(400, 'Error: Invalid Company Name');
    }
    if (!validators.isValidABN(companyAbn)) {
        throw helpers.errorReturn(400, 'Error: Invalid Company ABN');
    }
    if (!validators.isValidEmail(companyEmail)) {
        throw helpers.errorReturn(400, 'Error: Invalid Email');
    }
    if (!validators.isValidPhone(contactNumber)) {
        throw helpers.errorReturn(400, 'Error: Invalid Phone Number');
    }
    
    return {
        companyId: uuidv4(),
        name: companyName,
        abn: companyAbn,
        headquarters: headquarters,
        phone: contactNumber,
        email: companyEmail,
        owner: user.userId,
        admins: [user.userId],
        members: [user.userId],
        invoices: []
    }
    }
    
export function getCompany(companyId: string): Company {
    const dataStore = getData();
    const company = dataStore.companies.find((object) => object.companyId === companyId);
    if (company === undefined) {
        throw helpers.errorReturn(400, 'Error: Company does not exist');
    }
    return company;
}

const validateInvoiceDetails = (invoiceDetails: InvoiceDetails) => {
    invoiceDetails.items.forEach((item: any) => {
        const fieldsToCheck = [
            'quantity',
            'unitPrice',
            'discountAmount',
            'taxAmount',
            'taxRate',
            'totalAmount'
        ];

        fieldsToCheck.forEach(field => {
            if (item[field] < 0) {
                throw helpers.errorReturn(400, `Invalid value for ${field}: ${item[field]} cannot be negative.`);
            }
        });
    });
};
    

export function generateInvoice(invoiceId: string, userId: string, companyId: string, invoiceDetails: InvoiceDetails) {
    validateInvoiceDetails(invoiceDetails);

    const invoice = {
        invoiceId: invoiceId, 
        userId: userId,
        // I believe this should be either null or a string
        companyId: companyId,
        details: invoiceDetails
    }

    return invoice;
}
