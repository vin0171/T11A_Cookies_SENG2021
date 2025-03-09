import { stat } from "fs";
import { getData } from "./dataStore";
import * as helpers from './helper';
import * as validators from './validationHelpers';
import {Gender, User, Session, TokenObject, Company, Location, Invoice } from './interface';


export function createUser(email: string, password: string, nameFirst: string, nameLast: string, age: number) : User {
    const dataStore = getData();

    if (!validators.isValidName(nameFirst) || !validators.isValidName(nameLast)) {
		throw helpers.errorReturn(400, 'Error: Invalid Name');
	}

	if (validators.isValidEmail(email)) {
		throw helpers.errorReturn(400, 'Error: Invalid Email');
	}
	
	if (dataStore.users.find((object) => object.email === email) !== undefined) {
		throw helpers.errorReturn(400, 'Error: Email already used by another User');
	}

	if (!validators.isValidPass(password)) {
		throw helpers.errorReturn(400, 'Error: Invalid Password');
	}
    
    return {
        userId: dataStore.otherData.userCount + 1,
        companyId: -1,
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
        worksAt: null,
    }
}

export function getUser(userId: number, email?: string ) : User {
    const dataStore = getData();
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



export function createSession(user: User) : Session {
    const dataStore = getData();
    const nextId = helpers.nextAvailableId(dataStore.sessions, 'session');
    const secureHash = helpers.getTokenHash(user.userId, nextId);
    
    return {
        sessionId: nextId,
		userId: user.userId,
		secureHash: secureHash,
		timeCreated: new Date(),
		expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
	};
}

export function getSession(sessionId: number) : Session {
    const dataStore = getData();
    const session = dataStore.sessions.find((object) => object.sessionId === sessionId);
    if (session === undefined) {
        throw helpers.errorReturn(400, 'Error: Session does not exist');
    }
    return session;
}

export function createToken(session: Session) : TokenObject {
    return {
        token: JSON.stringify(session),
    }
}

export function createCompany(companyName: string, companyAbn: string, headquarters: Location, companyEmail: string, contactNumber: string,
    user: User): Company {
        const dataStore = getData();
        
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
            companyId: dataStore.otherData.companiesCount + 1,
            name: companyName,
            abn: companyAbn,
            headquarters: headquarters,
            phone: contactNumber,
            email: companyEmail,
            owner: user.userId,
            admins: [user.userId],
            members: [],
            invoices: {
                main: [],
                trash: [],
                archive: []
            }
        }
    }
    
export function getCompany(companyId: number): Company {
    const dataStore = getData();
    const company = dataStore.companies.find((object) => object.companyId === companyId);
    if (company === undefined) {
        throw helpers.errorReturn(400, 'Error: Company does not exist');
    }
    return company;
}
    

export function createInvoice() {
    
}


export function getInvoice(invoiceId: number): Invoice {
    const dataStore = getData();
    const invoice = dataStore.invoices.find((object) => object.invoiceId === invoiceId);
    if (invoice === undefined) {
        throw helpers.errorReturn(400, 'Error: Invoice does not exist');
    }
    return invoice;
}
