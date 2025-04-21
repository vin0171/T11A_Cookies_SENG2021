"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.userLogin = userLogin;
exports.registerUserV3 = registerUserV3;
exports.userLoginV3 = userLoginV3;
const dataStore_1 = require("./dataStore");
const interfaceHelpers_1 = require("./interfaceHelpers");
const validationHelpers_1 = require("./validationHelpers");
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
// ! DEPRECATED
function registerUser(email, password, nameFirst, nameLast, age) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, dataStore_1.getData)();
        const newUser = yield (0, interfaceHelpers_1.createUser)(email, password, nameFirst, nameLast, age);
        yield data.put({ TableName: "Users", Item: newUser });
        const token = (0, interfaceHelpers_1.createToken)(newUser.userId);
        return token;
    });
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
// ! DEPRECATED
function userLogin(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, dataStore_1.getData)();
        const user = yield (0, validationHelpers_1.authenticateUser)(email, password);
        const newSuccessLogins = user.numSuccessfulLogins + 1;
        const updateExpression = 'SET numSuccessfulLogins = :increment, numFailedPasswordsSinceLastLogin = :zero';
        data.update({
            TableName: "Users",
            Key: { userId: user.userId },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: { ':increment': newSuccessLogins, ':zero': 0 },
            ReturnValues: 'ALL_NEW',
        });
        return (0, interfaceHelpers_1.createToken)(user.userId);
    });
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
// ========================================================================= //
// New Stuff
// ========================================================================= //
function registerUserV3(email, password, nameFirst, nameLast) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, dataStore_1.getData)();
        const newUser = yield (0, interfaceHelpers_1.createUserV3)(email, password, nameFirst, nameLast);
        yield data.put({ TableName: "Users", Item: newUser });
        const token = (0, interfaceHelpers_1.createToken)(newUser.userId);
        return token;
    });
}
function userLoginV3(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, dataStore_1.getData)();
        const user = yield (0, validationHelpers_1.authenticateUserV3)(email, password);
        return (0, interfaceHelpers_1.createToken)(user.userId);
    });
}
