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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
exports.isValidName = isValidName;
exports.isValidEmail = isValidEmail;
exports.isValidPass = isValidPass;
exports.authenticateUser = authenticateUser;
exports.isValidABN = isValidABN;
exports.validateLocation = validateLocation;
exports.isValidPhone = isValidPhone;
exports.validateUsersPerms = validateUsersPerms;
exports.validateAdminPerms = validateAdminPerms;
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const helpers = __importStar(require("./helper"));
const dataStore_1 = require("./dataStore");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// isValid{name} to validate generic types::: Return True or False
// validate{name} to validate specific types from interface.ts::: Return the object or throws an error
const validateToken = (token) => {
    try {
        const dataStore = (0, dataStore_1.getData)();
        const currentToken = jsonwebtoken_1.default.verify(token, helpers.SECRET);
        const user = dataStore.users.find((user) => user.userId === currentToken.userId);
        return user;
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw helpers.errorReturn(401, 'Error: Token has expired - Please log in again');
        }
        else if (err.name === 'NotBeforeError') {
            throw helpers.errorReturn(401, 'Error: Token is not active');
        }
        else {
            throw helpers.errorReturn(401, 'Error: Invalid Token');
        }
    }
};
exports.validateToken = validateToken;
function isValidName(name) {
    const MIN_NAME_LEN = 2;
    const MAX_NAME_LEN = 20;
    const ALLOWED_CHARS = /[^a-zA-Z '-]/;
    if (name.length < MIN_NAME_LEN || name.length > MAX_NAME_LEN) {
        return false;
    }
    if (ALLOWED_CHARS.test(name)) {
        return false;
    }
    return true;
}
function isValidEmail(email) {
    if (!(0, isEmail_1.default)(email)) {
        return false;
    }
    return true;
}
function isValidPass(password) {
    const MIN_PASSWORD_LEN = 8;
    const LOWERCASE_LETTERS = /[a-z]/;
    const UPPERCASE_LETTERS = /[A-Z]/;
    const NUMBERS = /[0-9]/;
    if (password.length < MIN_PASSWORD_LEN) {
        return false;
    }
    if (((LOWERCASE_LETTERS.test(password) || UPPERCASE_LETTERS.test(password)) &&
        NUMBERS.test(password)) === false) {
        return false;
    }
    return true;
}
;
function authenticateUser(email, password) {
    const dataStore = (0, dataStore_1.getData)();
    if (!isValidEmail(email)) {
        throw helpers.errorReturn(400, 'Error: Invalid Email');
    }
    const user = dataStore.users.find((object) => object.email === email);
    if (user === undefined) {
        throw helpers.errorReturn(400, 'Error: Email does not exist');
    }
    if (user.password !== helpers.getPasswordHash(password)) {
        user.numFailedPasswordsSinceLastLogin++;
        throw helpers.errorReturn(400, 'Error: Incorrect Password');
    }
    return user;
}
function isValidABN(abn) {
    const ABN_REGEX = /^\d{11}$/;
    if (!ABN_REGEX.test(abn)) {
        return false;
    }
    return true;
}
function validateLocation(address, city, state, postcode, country) {
    // ???? 
    // if (!isValidName(address)) {
    //     throw helpers.errorReturn(400, 'Error: Invalid Address');
    // }
    if (!isValidName(city)) {
        throw helpers.errorReturn(400, 'Error: Invalid City');
    }
    if (!isValidName(state)) {
        throw helpers.errorReturn(400, 'Error: Invalid State');
    }
    // if (!isValidName(postcode)) {
    //     throw helpers.errorReturn(400, 'Error: Invalid Postcode');
    // }
    if (!isValidName(country)) {
        throw helpers.errorReturn(400, 'Error: Invalid Country');
    }
    return {
        address: address,
        city: city,
        state: state,
        postcode: postcode,
        country: country,
    };
}
function isValidPhone(phone) {
    // TODO: This needs a lot of work
    const PHONE_REGEX = /^\d{10}$/;
    if (!PHONE_REGEX.test(phone)) {
        return false;
    }
    return true;
}
// This function is for people who are members of a company but not an admin,
// they can only create and read invoices.
function validateUsersPerms(user, invoiceId) {
    const dataStore = (0, dataStore_1.getData)();
    const invoice = dataStore.invoices.find((object) => object.invoiceId === invoiceId);
    if (invoice === undefined) {
        throw helpers.errorReturn(400, 'Error: Invoice does not exist');
    }
    // Check if the invoice is not a company invoice and it wasn't made by the current user
    // or check if the invoice is a company invoice and if the current user belongs to that company.
    if ((!invoice.companyId && invoice.userId != user.userId) || (invoice.companyId && invoice.companyId != user.companyId)) {
        throw helpers.errorReturn(403, 'Error: User does not have access to this invoice');
    }
    return invoice;
}
function validateAdminPerms(user, invoiceId) {
    const data = (0, dataStore_1.getData)();
    const invoice = validateUsersPerms(user, invoiceId);
    const company = data.companies.find((c) => c.companyId === invoice.companyId);
    if (company === undefined) {
        throw helpers.errorReturn(400, 'Error: Company does not exist');
    }
    if (!company.admins.includes(user.userId)) {
        throw helpers.errorReturn(403, 'Error: User is not an admin');
    }
    return invoice;
}
