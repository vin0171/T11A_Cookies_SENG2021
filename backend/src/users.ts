import { getData } from './dataStore';
import * as helpers from './helper';
import {TokenObject, Gender, User, Session } from './interface';
import { createSession, createToken, createUser } from './interfaceCreates';

/**
 * Stub for the userRegister function.
 *
 * Register a user with an email, password, and names,
 * then returns a Token.
 *
 *
 * @param {string} email - email of the user
 * @param {string} password - password the user wants to use
 * @param {string} nameFirst - First name of the user
 * @param {string} nameLast - Last name of the user
 * @returns {{authUserId: number}}
 */

// Change age to DOB
export function registerUser(email: string, password: string, nameFirst: string, nameLast: string, age: number): TokenObject {
    const dataStore = getData();

	if (!helpers.isValidName(nameFirst, nameLast)) {
		throw helpers.errorReturn(400, 'Error: Invalid Name');
	}
	
	if (!helpers.isValidPass(password)) {
		throw helpers.errorReturn(400, 'Error: Invalid Password');
	}
	
	if (dataStore.users.find((object) => object.email === email) !== undefined) {
		throw helpers.errorReturn(400, 'Error: Email already used by another User');
	}


    const newUser: User = createUser(email, password, nameFirst, nameLast, age);

	dataStore.users.push(newUser);

	const newSession: Session = createSession(newUser);

	dataStore.sessions.push(newSession);

	const token: TokenObject = createToken(newSession);

	return token;
}


/**
 * Stub for the authLogin function.
 *
 * Login a user with an email and password,
 * then returns a Token.
 *
 *
 * @param {string} email - email of the user
 * @param {string} password - password the user wants to use
 * @returns {{authUserId: number}}
 */
export function authLogin(email: string, password: string): TokenObject {
	const dataStore = getData();

	const user = dataStore.users.find((object) => object.email === email);
	if (user === undefined) {
		throw helpers.errorReturn(400, 'Error: Email does not exist');
	}
	if (user.password !== helpers.getPasswordHash(password)) {
		user.numFailedPasswordsSinceLastLogin++;
		throw helpers.errorReturn(400, 'Error: Incorrect Password');
	}

	user.numSuccessfulLogins++;
	user.numFailedPasswordsSinceLastLogin = 0;

	const newSession: Session = createSession(user);
	dataStore.sessions.push(newSession);

	const token: TokenObject = createToken(newSession);
	return token;
}


/**
 * Stub for the authLogout function.
 *
 * Logout a user with a token.
 *
 *
 * @param {string} token - token of the user
 * @returns {boolean}
 */
export function authLogout(token: string): boolean {
	// TODO 

	
    return null;
}
