import { create } from 'domain';
import { getData, setData } from './dataStore';
import * as helpers from './helper';
import { Gender, User, Session, EmptyObject } from './interface';
import { createToken, createUser, validateUser } from './interfaceHelpers';
import { authenticateUser, validateToken } from './validationHelpers';
import { error } from 'console';

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
export function registerUser(email: string, password: string, nameFirst: string, nameLast: string, age: number): String {
    const dataStore = getData();
    const newUser: User = createUser(email, password, nameFirst, nameLast, age);
	dataStore.users.push(newUser);
	const token: string = createToken(newUser);
	newUser.token = token;
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

 */
export function userLogin(email: string, password: string): string {
	const user: User = authenticateUser(email, password);
	user.numSuccessfulLogins++;
	user.numFailedPasswordsSinceLastLogin = 0;
	user.token = createToken(user);
	return user.token;
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
	const user: User = validateToken(token);
	if (user.token == null) throw helpers.errorReturn(401, 'User has already logged out');
	user.token = null;
	return {};
}
