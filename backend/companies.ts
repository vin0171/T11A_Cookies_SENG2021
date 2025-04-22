import { getData } from "./dataStore";
import { Company, EmptyObject, Location, OldCompany } from "./interface";
import { createCompany, createCompanyV3, getCompany, getUserByEmail } from "./interfaceHelpers";
import * as validators from './validationHelpers';
import HTTPError from 'http-errors';


async function updateUserCompany(userId: string, companyId: string) {
    const data = getData();
    const updateExpression = 'SET companyId = :companyId'
	await data.update({
		TableName: "Users", 
		Key: { userId: userId },
		UpdateExpression: updateExpression,
		ExpressionAttributeValues: { ':companyId': companyId },
	});
}

/**
 * Stub for the registerCompany function.
 *
 * Register a company with a name, ABN, email, password, and contact number,
 * then returns a Token. 
 * This company is registered under an admin account.
 *
 *
 * @param {string} companyName - name of the company
 * @param {string} companyAbn - ABN of the company
 * @param {string} contactNumber - contact number of the company
 */
// ! DEPRECATED
export async function registerCompany(token: string, companyName: string, companyAbn: string, headquarters: Location, 
    companyEmail: string, contactNumber: string): Promise<string> { 
    const user = await validators.validateToken(token);
    if (user.companyId !== null) throw HTTPError(400, 'Error: User already works at a company'); 
    const newCompany: OldCompany = createCompany(companyName, companyAbn, headquarters, companyEmail, contactNumber, user.userId);
    const data = getData();
    await data.put({ TableName: "Companies", Item: newCompany});
    await updateUserCompany(user.userId, newCompany.companyId);
    return newCompany.companyId;
}

/**
 * Stub for the addCompanyUser function.
 *
 * Add a user to a company with an email,
 * then returns a boolean.
 *
 *
 * @param {string} email - email of the user
 * @returns {object}
 */

export async function addCompanyUserV3(token: string, companyId: string, email: string): Promise<EmptyObject> {
    const user = await validators.validateToken(token);
    const company = await getCompany(companyId);
    if (!company.members.includes(user.userId)) {
        throw HTTPError(403, 'Error: User is not apart of this company')
    }

    if (!company.admins.includes(user.userId)) {
        throw HTTPError(403, 'Error: User is not authorised to add users')
    }

    const userToAdd = await getUserByEmail(email);
    if (userToAdd === undefined) {
        throw HTTPError(400, 'Error: User with this email does not exist');
    }

    if (userToAdd.companyId !== null) {
        throw HTTPError(400, 'Error: User already works at a company');
    }
    
    const data = getData();
    await data.update({        
        TableName: "Companies",
        Key: { companyId: companyId }, 
        UpdateExpression: "SET members = list_append(members, :newItem)",
        ExpressionAttributeValues: {
            ":newItem": [ userToAdd.userId ], 
        },
    });

    await updateUserCompany(userToAdd.userId, companyId);
    return {};
}


// ========================================================================= //
// New Stuff
// ========================================================================= //


export async function registerCompanyV3(token: string, companyName: string, companyAbn: string, headquarters: Location, 
    companyEmail: string, contactNumber: string): Promise<string> { 
    const user = await validators.validateToken(token);
    if (user.companyId !== null) throw HTTPError(400, 'Error: User already registered a company'); 
    const newCompany: Company = createCompanyV3(companyName, companyAbn, headquarters, companyEmail, contactNumber, user.userId);
    const data = getData();
    await data.put({ TableName: "Companies", Item: newCompany});
    await updateUserCompany(user.userId, newCompany.companyId);
    return newCompany.companyId;
}
