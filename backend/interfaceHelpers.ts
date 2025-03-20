import {v4 as uuidv4} from 'uuid';
import { getData } from "./dataStore";
import * as helpers from './helper';
import * as validators from './validationHelpers';
import {Company, Gender, InvoiceDetails, InvoiceItem, Location, User, UserOptions} from './interface';
import { SECRET } from "./helper";
import jwt from 'jsonwebtoken';
import { GetCommand, QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import HTTPError from 'http-errors';

export async function createUser(email: string, password: string, nameFirst: string, nameLast: string, age: number) : Promise<User> {
    const dataStore = getData();

    if (!validators.isValidName(nameFirst) || !validators.isValidName(nameLast)) {
		throw HTTPError(400, 'Error: Invalid Name');
	}

	if (!validators.isValidEmail(email)) {
		throw HTTPError(400, 'Error: Invalid Email');
	}

    const user: QueryCommandOutput = await dataStore.query({
        TableName: "Users", 
        IndexName: "EmailIndex",
        KeyConditionExpression: 'email = :email', 
        ExpressionAttributeValues: {
            ':email': email
        }
    });

    if (user.Items && user.Items.length == 1) {
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

// this is degenerate (tree)
// export function getUser({userId, email}: UserOptions) : User {
//     const dataStore = getData();
//     if (!userId && !email) {
//         throw HTTPError(400, 'Error: Provide either a user ID or an email')
//     }

//     if (email !== undefined) {
//         if (!validators.isValidEmail(email)) {
//             throw HTTPError(400, 'Error: Invalid Email');
//         }
//         const user = dataStore.users.find((object) => object.email === email);
//         if (user === undefined) {
//             throw HTTPError(400, 'Error: Email does not exist');
//         }
//         return user;
//     }

//     const user = dataStore.users.find((object) => object.userId === userId);
//     if (user === undefined) {
//         throw HTTPError(400, 'Error: User does not exist');
//     }
//     return user;
// }

// // TODO: why?
// export function validateUser() : boolean {
//     return true
// }

export function createToken(userId: string) : string {
    // the time created is called (iat), and its automatically included in the creation
    const data = { userId: userId }
    return jwt.sign(data, SECRET, {expiresIn: '7d'})
}

// export function createCompany(companyName: string, companyAbn: string, headquarters: Location, companyEmail: string, contactNumber: string,
//     user: User): Company {

//     if (!validators.isValidName(companyName)) {
//         throw HTTPError(400, 'Error: Invalid Company Name');
//     }
//     if (!validators.isValidABN(companyAbn)) {
//         throw HTTPError(400, 'Error: Invalid Company ABN');
//     }
//     if (!validators.isValidEmail(companyEmail)) {
//         throw HTTPError(400, 'Error: Invalid Email');
//     }
//     if (!validators.isValidPhone(contactNumber)) {
//         throw HTTPError(400, 'Error: Invalid Phone Number');
//     }
    
//     return {
//         companyId: uuidv4(),
//         name: companyName,
//         abn: companyAbn,
//         headquarters: headquarters,
//         phone: contactNumber,
//         email: companyEmail,
//         owner: user.userId,
//         admins: [user.userId],
//         members: [user.userId],
//         invoices: []
//     }
//     }
    
// export async function getCompany(companyId: string): Promise<Company> {
//     const dataStore = await getData();
//     //ataStore.send(new GetItemCommand())
//     // const company = dataStore.companies.find((object) => object.companyId === companyId);
//     // if (company === undefined) {
//     //     throw HTTPError(400, 'Error: Company does not exist');
//     // }
//     // return company;
// }

// const validateInvoiceDetails = (invoiceDetails: InvoiceDetails) => {
//     invoiceDetails.items.forEach((item: InvoiceItem) => {
//         const fieldsToCheck: (keyof InvoiceItem)[] = [
//             'quantity',
//             'unitPrice',
//             'discountAmount',
//             'taxAmount',
//             'taxRate',
//             'totalAmount'
//         ];

//         fieldsToCheck.forEach((field: keyof InvoiceItem) => {
//             if (typeof item[field] !== 'number') {
//                 throw HTTPError(400, `Invalid value for ${field}: ${item[field]} is not a number.`);
//             }

//             if (item[field] < 0) {
//                 throw HTTPError(400, `Invalid value for ${field}: ${item[field]} cannot be negative.`);
//             }
//         });
//     });
// };
    

// export function generateInvoice(invoiceId: string, userId: string, companyId: string, invoiceDetails: InvoiceDetails) {
//     validateInvoiceDetails(invoiceDetails);

//     const invoice = {
//         invoiceId: invoiceId, 
//         userId: userId,
//         // I believe this should be either null or a string
//         companyId: companyId,
//         details: invoiceDetails
//     }

//     return invoice;
// }
