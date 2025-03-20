import { PutItemCommand, QueryCommandOutput } from '@aws-sdk/client-dynamodb';
import { getData } from './dataStore';
import * as helpers from './helper'
import { User,  EmptyObject } from './interface';
import { createToken, createUser } from './interfaceHelpers';
import { authenticateUser, validateToken } from './validationHelpers';
import { PutCommand } from '@aws-sdk/lib-dynamodb';


/** 
 * UserRegister function.
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
export async function registerUser(email: string, password: string, nameFirst: string, nameLast: string, age: number): Promise<string> {
    const data = getData();
    const newUser: User = await createUser(email, password, nameFirst, nameLast, age);

	await data.put({TableName: "Users", Item: newUser});

	const token: string = createToken(newUser.userId);
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
export async function userLogin(email: string, password: string): Promise<string> {
	const data = getData();
	const user = await authenticateUser(email, password);
	const newSuccessLogins = user.numSuccessfulLogins + 1;
	const updateExpression = 'SET numSuccessfulLogins = :increment, numFailedPasswordsSinceLastLogin = :zero';
	data.update({
		TableName: "Users", 
		Key: { userId: user.userId },
		UpdateExpression: updateExpression,
		ExpressionAttributeValues: { ':increment': newSuccessLogins, ':zero': 0 },
		ReturnValues: 'ALL_NEW',
	})
	return createToken(user.userId);
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
// export function userLogout(token: string): EmptyObject {
// 	const user: User = validateToken(token);
// 	if (user.token == null) throw helpers.errorReturn(401, 'User has already logged out');
// 	user.token = null;
// 	return {};
// }
