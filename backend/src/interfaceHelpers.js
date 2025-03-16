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
exports.createUser = createUser;
exports.getUser = getUser;
exports.validateUser = validateUser;
exports.createToken = createToken;
exports.createCompany = createCompany;
exports.getCompany = getCompany;
exports.generateInvoice = generateInvoice;
exports.getInvoice = getInvoice;
const uuid_1 = require("uuid");
const dataStore_1 = require("./dataStore");
const helpers = __importStar(require("./helper"));
const validators = __importStar(require("./validationHelpers"));
const interface_1 = require("./interface");
const helper_1 = require("./helper");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createUser(email, password, nameFirst, nameLast, age) {
    const dataStore = (0, dataStore_1.getData)();
    if (!validators.isValidName(nameFirst) || !validators.isValidName(nameLast)) {
        throw helpers.errorReturn(400, 'Error: Invalid Name');
    }
    if (!validators.isValidEmail(email)) {
        throw helpers.errorReturn(400, 'Error: Invalid Email');
    }
    if (dataStore.users.find((object) => object.email === email) !== undefined) {
        throw helpers.errorReturn(400, 'Error: Email already used by another User');
    }
    if (!validators.isValidPass(password)) {
        throw helpers.errorReturn(400, 'Error: Invalid Password');
    }
    return {
        token: null,
        userId: (0, uuid_1.v4)(),
        companyId: null,
        email: email,
        password: helpers.getPasswordHash(password),
        nameFirst: nameFirst,
        nameLast: nameLast,
        numSuccessfulLogins: 0,
        numFailedPasswordsSinceLastLogin: 0,
        age: age,
        gender: interface_1.Gender.OTHER,
        timeCreated: new Date(),
        previousPasswords: [],
        invoices: []
    };
}
function getUser({ userId, email }) {
    const dataStore = (0, dataStore_1.getData)();
    if (!userId && !email) {
        throw helpers.errorReturn(400, 'Error: Provide either a user ID or an email');
    }
    if (email !== undefined) {
        if (!validators.isValidEmail(email)) {
            throw helpers.errorReturn(400, 'Error: Invalid Email');
        }
        const user = dataStore.users.find((object) => object.email === email);
        if (user === undefined) {
            throw helpers.errorReturn(400, 'Error: Email does not exist');
        }
        return user;
    }
    const user = dataStore.users.find((object) => object.userId === userId);
    if (user === undefined) {
        throw helpers.errorReturn(400, 'Error: User does not exist');
    }
    return user;
}
function validateUser() {
    return true;
}
function createToken(user) {
    // the time created is called (iat), and its automatically included in the creation
    const data = {
        userId: user.userId,
    };
    return jsonwebtoken_1.default.sign(data, helper_1.SECRET, { expiresIn: '7d' });
}
function createCompany(companyName, companyAbn, headquarters, companyEmail, contactNumber, user) {
    // check if the company name is valid
    if (!validators.isValidName(companyName)) {
        throw helpers.errorReturn(400, 'Error: Invalid Company Name');
    }
    if (!validators.isValidABN(companyAbn)) {
        throw helpers.errorReturn(400, 'Error: Invalid Company ABN');
    }
    if (!validators.isValidEmail(companyEmail)) {
        throw helpers.errorReturn(400, 'Error: Invalid Email');
    }
    if (!validators.isValidPhone(contactNumber)) {
        throw helpers.errorReturn(400, 'Error: Invalid Phone Number');
    }
    return {
        companyId: (0, uuid_1.v4)(),
        name: companyName,
        abn: companyAbn,
        headquarters: headquarters,
        phone: contactNumber,
        email: companyEmail,
        owner: user.userId,
        admins: [user.userId],
        members: [user.userId],
        invoices: []
    };
}
function getCompany(companyId) {
    const dataStore = (0, dataStore_1.getData)();
    const company = dataStore.companies.find((object) => object.companyId === companyId);
    if (company === undefined) {
        throw helpers.errorReturn(400, 'Error: Company does not exist');
    }
    return company;
}
const validateInvoiceDetails = (invoiceDetails) => {
    invoiceDetails.items.forEach((item) => {
        const fieldsToCheck = [
            'quantity',
            'unitPrice',
            'discountAmount',
            'taxAmount',
            'taxRate',
            'totalAmount'
        ];
        fieldsToCheck.forEach(field => {
            if (item[field] < 0) {
                throw helpers.errorReturn(400, `Invalid value for ${field}: ${item[field]} cannot be negative.`);
            }
        });
    });
};
function generateInvoice(invoiceId, userId, companyId, invoiceDetails) {
    validateInvoiceDetails(invoiceDetails);
    const invoice = {
        invoiceId: invoiceId,
        userId: userId,
        // I believe this should be either null or a string
        companyId: companyId,
        details: invoiceDetails
    };
    return invoice;
}
function getInvoice(invoiceId) {
    const dataStore = (0, dataStore_1.getData)();
    const invoice = dataStore.invoices.find((object) => object.invoiceId === invoiceId);
    if (invoice === undefined) {
        throw helpers.errorReturn(400, 'Error: Invoice does not exist');
    }
    return invoice;
}
