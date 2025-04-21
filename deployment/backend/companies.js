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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCompany = registerCompany;
exports.addCompanyUserV3 = addCompanyUserV3;
exports.registerCompanyV3 = registerCompanyV3;
const dataStore_1 = require("./dataStore");
const interfaceHelpers_1 = require("./interfaceHelpers");
const validators = __importStar(require("./validationHelpers"));
const http_errors_1 = __importDefault(require("http-errors"));
function updateUserCompany(userId, companyId) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, dataStore_1.getData)();
        const updateExpression = 'SET companyId = :companyId';
        yield data.update({
            TableName: "Users",
            Key: { userId: userId },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: { ':companyId': companyId },
        });
    });
}
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
// ! DEPRECATED
function registerCompany(token, companyName, companyAbn, headquarters, companyEmail, contactNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield validators.validateToken(token);
        if (user.companyId !== null)
            throw (0, http_errors_1.default)(400, 'Error: User already works at a company');
        const newCompany = (0, interfaceHelpers_1.createCompany)(companyName, companyAbn, headquarters, companyEmail, contactNumber, user.userId);
        const data = (0, dataStore_1.getData)();
        yield data.put({ TableName: "Companies", Item: newCompany });
        yield updateUserCompany(user.userId, newCompany.companyId);
        return newCompany.companyId;
    });
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
function addCompanyUserV3(token, companyId, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield validators.validateToken(token);
        const company = yield (0, interfaceHelpers_1.getCompany)(companyId);
        if (!company.members.includes(user.userId)) {
            throw (0, http_errors_1.default)(403, 'Error: User is not apart of this company');
        }
        if (!company.admins.includes(user.userId)) {
            throw (0, http_errors_1.default)(403, 'Error: User is not authorised to add users');
        }
        const userToAdd = yield (0, interfaceHelpers_1.getUserByEmail)(email);
        if (userToAdd === undefined) {
            throw (0, http_errors_1.default)(400, 'Error: User with this email does not exist');
        }
        if (userToAdd.companyId !== null) {
            throw (0, http_errors_1.default)(400, 'Error: User already works at a company');
        }
        const data = (0, dataStore_1.getData)();
        yield data.update({
            TableName: "Companies",
            Key: { companyId: companyId },
            UpdateExpression: "SET members = list_append(members, :newItem)",
            ExpressionAttributeValues: {
                ":newItem": [userToAdd.userId],
            },
        });
        yield updateUserCompany(userToAdd.userId, companyId);
        return {};
    });
}
// ========================================================================= //
// New Stuff
// ========================================================================= //
function registerCompanyV3(token, companyName, companyAbn, headquarters, companyEmail, contactNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield validators.validateToken(token);
        if (user.companyId !== null)
            throw (0, http_errors_1.default)(400, 'Error: User already registered a company');
        const newCompany = (0, interfaceHelpers_1.createCompanyV3)(companyName, companyAbn, headquarters, companyEmail, contactNumber, user.userId);
        const data = (0, dataStore_1.getData)();
        yield data.put({ TableName: "Companies", Item: newCompany });
        yield updateUserCompany(user.userId, newCompany.companyId);
        return newCompany.companyId;
    });
}
