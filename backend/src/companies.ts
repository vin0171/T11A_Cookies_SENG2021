import * as helpers from "./helper";
import { Company, Location, TokenObject, User } from "./interface";
import { createCompany, getCompany, getUser } from "./interfaceHelpers";
import * as validators from './validationHelpers';


/**
 * Stub for the registerCompany function.
 *
 * Register a company with a name, ABN, email, password, and contact number,
 * then returns a Token.
 *
 *
 * @param {string} companyName - name of the company
 * @param {string} companyAbn - ABN of the company
 * @param {string} adminEmail - email of the admin
 * @param {string} adminPassword - password of the admin
 * @param {string} contactNumber - contact number of the company
 * @returns {{authUserId: number}}
 */
export function registerCompany(token: string, companyName: string, companyAbn: string, headquarters: Location, 
    companyEmail: string, contactNumber: string): number {

    const user: User = validators.validateSessionToken(token);
    
    if (user.worksAt !== null) {
        throw helpers.errorReturn(400, 'Error: User already works at a company');
    }
    
    const newCompany: Company = createCompany(companyName, companyAbn, headquarters, companyEmail, contactNumber, user);
    
    user.worksAt = newCompany.companyId;

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

// shuold check if the users token is valid to edit that company
export function addCompanyUser(token: string, companyId: number, email: string): boolean {
    const user: User = validators.validateSessionToken(token);
    const company: Company = getCompany(companyId);

    // Check if email is valid
    const newUser: User = getUser(null, email);

    if (newUser.worksAt !== null) {
        throw helpers.errorReturn(400, 'Error: User already works at a company');
    }
    
    company.members.push(newUser.userId);
    newUser.worksAt = companyId;


    return null;
}


