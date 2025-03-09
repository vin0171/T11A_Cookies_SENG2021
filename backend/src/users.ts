import { create } from 'domain';
import { getData, setData } from './dataStore';
import * as helpers from './helper';
import {TokenObject, Gender, User, Session, EmptyObject } from './interface';
import { createSession, createToken, createUser, validateUser } from './interfaceHelpers';
import { authenticateUser } from './validationHelpers';

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
 * @returns {{authUserId: string}}
 */

// Change age to DOB
export function registerUser(email: string, password: string, nameFirst: string, nameLast: string, age: number): TokenObject {
    const dataStore = getData();

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
 * @returns {{authUserId: string}}
 */
export function userLogin(email: string, password: string): TokenObject {
	const dataStore = getData();

	// Check if email is valid
	const user: User = authenticateUser(email, password);

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
 * @returns {}
 */
export function userLogout(token: string): EmptyObject {
	// TODO

	return null;
}
