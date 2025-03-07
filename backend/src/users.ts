import { getData, setData } from './dataStore';
import * as helpers from './helper';
import {TokenObject, Gender, User } from './interface';

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

    if (dataStore.users.find((object) => object.email === email) !== undefined) throw helpers.errorReturn(400, 'Email already in use');

    const newUser : User = {
		userId: dataStore.otherData.userCount + 1,
		companyId: -1,
		email: email,
		password: helpers.getPasswordHash(password),
		nameFirst: nameFirst,
		nameLast: nameLast,
		numSuccessfulLogins: 0,
		numFailedPasswordsSinceLastLogin: 0,
		age: 0,
		gender: Gender.OTHER,
		timeCreated: new Date(),
		previousPasswords: []
	};

	dataStore.users.push(newUser);

	const nextId = helpers.nextAvailableId(dataStore.sessions, 'session');
	const secureHash = helpers.getTokenHash(newUser.email + newUser.password + nextId);

	const newSession = {
		sessionId: nextId,
		userId: newUser.userId,
		timeCreated: new Date(),
		expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
	};
	dataStore.sessions.push(newSession);

	return {
		token: JSON.stringify(newSession),
	};
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
export function authLogin(email: string, password: string): number {

    return null;
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

    return null;
}
