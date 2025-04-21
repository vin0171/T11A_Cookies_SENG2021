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
exports.validateToken = void 0;
exports.isValidName = isValidName;
exports.isValidEmail = isValidEmail;
exports.isValidPass = isValidPass;
exports.authenticateUser = authenticateUser;
exports.authenticateUserV3 = authenticateUserV3;
exports.isValidABN = isValidABN;
exports.isValidPhone = isValidPhone;
exports.validateLocation = validateLocation;
exports.validateUsersPerms = validateUsersPerms;
exports.validateAdminPerms = validateAdminPerms;
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const helpers = __importStar(require("./helper"));
const dataStore_1 = require("./dataStore");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
const interfaceHelpers_1 = require("./interfaceHelpers");
const validateToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = (0, dataStore_1.getData)();
        const currentToken = jsonwebtoken_1.default.verify(token, helpers.SECRET);
        const response = yield data.get({ TableName: "Users", Key: { userId: currentToken.userId } });
        // TODO: handle case where undefined throw error of response?
        const user = response.Item;
        return user;
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw (0, http_errors_1.default)(401, 'Error: Token has expired - Please log in again');
        }
        else if (err.name === 'NotBeforeError') {
            throw (0, http_errors_1.default)(401, 'Error: Token is not active');
        }
        else {
            throw (0, http_errors_1.default)(401, 'Error: Invalid Token');
        }
    }
});
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
// ! DEPRECATED
function authenticateUser(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, dataStore_1.getData)();
        const user = yield (0, interfaceHelpers_1.getUserByEmail)(email);
        if (user === undefined) {
            throw (0, http_errors_1.default)(400, 'Error: User with this email does not exist');
        }
        // TODO: Maybe chuck it in another function the update
        if (user.password && user.password !== helpers.getPasswordHash(password)) {
            const userFails = user.numFailedPasswordsSinceLastLogin + 1;
            const updateExpression = 'SET numFailedPasswordsSinceLastLogin = :fails';
            yield data.update({
                TableName: "Users",
                Key: { userId: user.userId },
                UpdateExpression: updateExpression,
                ExpressionAttributeValues: { ':fails': userFails },
            });
            throw (0, http_errors_1.default)(400, 'Error: Incorrect Password');
        }
        return user;
    });
}
function authenticateUserV3(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, interfaceHelpers_1.getUserByEmailV3)(email);
        if (user === undefined) {
            throw (0, http_errors_1.default)(400, 'Error: User with this email does not exist');
        }
        if (user.password && user.password !== helpers.getPasswordHash(password)) {
            throw (0, http_errors_1.default)(400, 'Error: Incorrect Password');
        }
        return user;
    });
}
function isValidABN(abn) {
    const ABN_REGEX = /^\d{11}$/;
    if (!ABN_REGEX.test(abn)) {
        return false;
    }
    return true;
}
function isValidPhone(phone) {
    // TODO: This needs a lot of work
    const PHONE_REGEX = /^\d{10}$/;
    if (!PHONE_REGEX.test(phone)) {
        return false;
    }
    return true;
}
function validateLocation(address, city, state, postcode, country) {
    // if (!isValidName(address)) {
    //     throw HTTPError(400, 'Error: Invalid Address');
    // }
    if (!isValidName(city)) {
        throw (0, http_errors_1.default)(400, 'Error: Invalid City');
    }
    if (!isValidName(state)) {
        throw (0, http_errors_1.default)(400, 'Error: Invalid State');
    }
    // if (!isValidName(postcode)) {
    //     throw HTTPError(400, 'Error: Invalid Postcode');
    // }
    if (!isValidName(country)) {
        throw (0, http_errors_1.default)(400, 'Error: Invalid Country');
    }
    return {
        address: address,
        city: city,
        state: state,
        postcode: postcode,
        country: country,
    };
}
// This function is for people who are members of a company but not an admin,
// they can only create and read invoices.
function validateUsersPerms(userId, userCompanyId, invoiceId) {
    return __awaiter(this, void 0, void 0, function* () {
        const invoice = yield (0, interfaceHelpers_1.getInvoice)(invoiceId);
        if (!invoice) {
            throw (0, http_errors_1.default)(403, 'Error: Invoice does not exist');
        }
        // Check if the invoice is not a company invoice and it wasn't made by the current user
        // or check if the invoice is a company invoice and if the current user belongs to that company.
        if ((!invoice.companyId && invoice.userId != userId) || (invoice.companyId && invoice.companyId != userCompanyId)) {
            throw (0, http_errors_1.default)(403, 'Error: User does not have access to this invoice');
        }
        return invoice;
    });
}
function validateAdminPerms(userId, userCompanyId, invoiceId) {
    return __awaiter(this, void 0, void 0, function* () {
        const invoice = yield validateUsersPerms(userId, userCompanyId, invoiceId);
        const company = yield (0, interfaceHelpers_1.getCompany)(userCompanyId);
        if (!company.admins.includes(userId)) {
            throw (0, http_errors_1.default)(403, 'Error: User is not an admin');
        }
        return invoice;
    });
}
