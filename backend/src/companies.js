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
exports.registerCompany = registerCompany;
exports.addCompanyUser = addCompanyUser;
const dataStore_1 = require("./dataStore");
const helpers = __importStar(require("./helper"));
const interfaceHelpers_1 = require("./interfaceHelpers");
const validators = __importStar(require("./validationHelpers"));
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
function registerCompany(token, companyName, companyAbn, headquarters, companyEmail, contactNumber) {
    const user = validators.validateToken(token);
    if (user.companyId !== null) {
        throw helpers.errorReturn(400, 'Error: User already works at a company');
    }
    const newCompany = (0, interfaceHelpers_1.createCompany)(companyName, companyAbn, headquarters, companyEmail, contactNumber, user);
    const dataStore = (0, dataStore_1.getData)();
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
function addCompanyUser(token, companyId, email) {
    const user = validators.validateToken(token);
    const company = (0, interfaceHelpers_1.getCompany)(companyId);
    if (!company.members.includes(user.userId)) {
        throw helpers.errorReturn(403, 'Error: User is not apart of this company');
    }
    if (!company.admins.includes(user.userId)) {
        throw helpers.errorReturn(403, 'Error: User is not authorised to add users');
    }
    // Check if email is valid
    const newUser = (0, interfaceHelpers_1.getUser)({ email: email });
    if (newUser.companyId !== null) {
        throw helpers.errorReturn(400, 'Error: User already works at a company');
    }
    company.members.push(newUser.userId);
    newUser.companyId = companyId;
    return {};
}
