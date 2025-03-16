"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.userLogin = userLogin;
exports.userLogout = userLogout;
const dataStore_1 = require("./dataStore");
const helpers = __importStar(require("./helper"));
const interfaceHelpers_1 = require("./interfaceHelpers");
const validationHelpers_1 = require("./validationHelpers");
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
function registerUser(email, password, nameFirst, nameLast, age) {
    const dataStore = (0, dataStore_1.getData)();
    const newUser = (0, interfaceHelpers_1.createUser)(email, password, nameFirst, nameLast, age);
    dataStore.users.push(newUser);
    const token = (0, interfaceHelpers_1.createToken)(newUser);
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
function userLogin(email, password) {
    const user = (0, validationHelpers_1.authenticateUser)(email, password);
    user.numSuccessfulLogins++;
    user.numFailedPasswordsSinceLastLogin = 0;
    user.token = (0, interfaceHelpers_1.createToken)(user);
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
function userLogout(token) {
    const user = (0, validationHelpers_1.validateToken)(token);
    if (user.token == null)
        throw helpers.errorReturn(401, 'User has already logged out');
    user.token = null;
    return {};
}
