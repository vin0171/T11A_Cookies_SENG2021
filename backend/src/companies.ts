import { getData } from "./dataStore";
import * as helpers from "./helper";
import { Company, EmptyObject, Location, User } from "./interface";
import { createCompany, getCompany, getUser } from "./interfaceHelpers";
import * as validators from './validationHelpers';


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
export function registerCompany(token: string, companyName: string, companyAbn: string, headquarters: Location, 
    companyEmail: string, contactNumber: string): string {

    const user: User = validators.validateToken(token);
    
    if (user.companyId !== null) {
        throw helpers.errorReturn(400, 'Error: User already works at a company');
    }
    
    const newCompany: Company = createCompany(companyName, companyAbn, headquarters, companyEmail, contactNumber, user);
    const dataStore = getData();
    dataStore.companies.push(newCompany);
    user.companyId = newCompany.companyId;
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

export function addCompanyUser(token: string, companyId: string, email: string): EmptyObject {
    const user: User = validators.validateToken(token);
    const company: Company = getCompany(companyId);
    if (!company.members.includes(user.userId)) {
        throw helpers.errorReturn(403, 'Error: User is not apart of this company')
    }

    if (!company.admins.includes(user.userId)) {
        throw helpers.errorReturn(403, 'Error: User is not authorised to add users')
    }

    // Check if email is valid
    const newUser: User = getUser({email: email});

    if (newUser.companyId !== null) {
        throw helpers.errorReturn(400, 'Error: User already works at a company');
    }
    
    company.members.push(newUser.userId);
    newUser.companyId = companyId;
    return {};
}


