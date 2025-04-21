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
exports.createUser = createUser;
exports.createUserV3 = createUserV3;
exports.getUserByEmail = getUserByEmail;
exports.getUserByEmailV3 = getUserByEmailV3;
exports.createToken = createToken;
exports.createCompany = createCompany;
exports.createCompanyV3 = createCompanyV3;
exports.getCompany = getCompany;
exports.generateInvoice = generateInvoice;
exports.generateInvoiceV2 = generateInvoiceV2;
exports.getInvoice = getInvoice;
exports.createCustomerV3 = createCustomerV3;
exports.getCustomer = getCustomer;
exports.getCustomerByEmailV3 = getCustomerByEmailV3;
exports.createItemV3 = createItemV3;
exports.getItem = getItem;
exports.getItemBySkuV3 = getItemBySkuV3;
const uuid_1 = require("uuid");
const dataStore_1 = require("./dataStore");
const helpers = __importStar(require("./helper"));
const validators = __importStar(require("./validationHelpers"));
const interface_1 = require("./interface");
const helper_1 = require("./helper");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
// ! DEPRECATED
function createUser(email, password, nameFirst, nameLast, age) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validators.isValidName(nameFirst) || !validators.isValidName(nameLast)) {
            throw (0, http_errors_1.default)(400, 'Error: Invalid Name');
        }
        const userExistsAlready = yield getUserByEmail(email);
        if (userExistsAlready !== undefined) {
            throw (0, http_errors_1.default)(400, 'Error: Email already used by another User');
        }
        if (!validators.isValidPass(password)) {
            throw (0, http_errors_1.default)(400, 'Error: Invalid Password');
        }
        return {
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
            timeCreated: new Date().toISOString(),
            previousPasswords: [],
            invoices: []
        };
    });
}
function createUserV3(email, password, nameFirst, nameLast) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validators.isValidName(nameFirst) || !validators.isValidName(nameLast)) {
            throw (0, http_errors_1.default)(400, 'Error: Invalid Name');
        }
        const userExistsAlready = yield getUserByEmailV3(email);
        if (userExistsAlready !== undefined) {
            throw (0, http_errors_1.default)(400, 'Error: Email already used by another User');
        }
        if (!validators.isValidPass(password)) {
            throw (0, http_errors_1.default)(400, 'Error: Invalid Password');
        }
        return {
            userId: (0, uuid_1.v4)(),
            companyId: null,
            email: email,
            password: helpers.getPasswordHash(password),
            nameFirst: nameFirst,
            nameLast: nameLast,
            timeCreated: new Date().toISOString(),
        };
    });
}
// Acts as a .find function returning undefined if none found 
// else returns the user Object
// ! DEPRECATED
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validators.isValidEmail(email)) {
            throw (0, http_errors_1.default)(400, 'Error: Invalid Email');
        }
        const data = (0, dataStore_1.getData)();
        const response = yield data.query({
            TableName: "Users",
            IndexName: "EmailIndex",
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        });
        return response.Items.length === 0 ? undefined : response.Items[0];
    });
}
function getUserByEmailV3(email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validators.isValidEmail(email)) {
            throw (0, http_errors_1.default)(400, 'Error: Invalid Email');
        }
        const data = (0, dataStore_1.getData)();
        const response = yield data.query({
            TableName: "Users",
            IndexName: "EmailIndex",
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        });
        return response.Items.length === 0 ? undefined : response.Items[0];
    });
}
function createToken(userId) {
    // the time created is called (iat), and its automatically included in the creation
    const data = { userId: userId };
    return jsonwebtoken_1.default.sign(data, helper_1.SECRET, { expiresIn: '7d' });
}
// ! DEPRECATED
function createCompany(companyName, companyAbn, headquarters, companyEmail, contactNumber, userId) {
    if (!validators.isValidName(companyName)) {
        throw (0, http_errors_1.default)(400, 'Error: Invalid Company Name');
    }
    if (!validators.isValidABN(companyAbn)) {
        throw (0, http_errors_1.default)(400, 'Error: Invalid Company ABN');
    }
    if (!validators.isValidEmail(companyEmail)) {
        throw (0, http_errors_1.default)(400, 'Error: Invalid Email');
    }
    if (!validators.isValidPhone(contactNumber)) {
        throw (0, http_errors_1.default)(400, 'Error: Invalid Phone Number');
    }
    return {
        companyId: (0, uuid_1.v4)(),
        name: companyName,
        abn: companyAbn,
        headquarters: headquarters,
        phone: contactNumber,
        email: companyEmail,
        owner: userId,
        admins: [userId],
        members: [userId],
        invoices: [],
        // // GONNA MAYBE BREAK OLD STUFF
        // customers: [],
        // items: []
    };
}
function createCompanyV3(companyName, companyAbn, headquarters, companyEmail, contactNumber, userId) {
    if (!validators.isValidName(companyName)) {
        throw (0, http_errors_1.default)(400, 'Error: Invalid Company Name');
    }
    if (!validators.isValidABN(companyAbn)) {
        throw (0, http_errors_1.default)(400, 'Error: Invalid Company ABN');
    }
    if (!validators.isValidEmail(companyEmail)) {
        throw (0, http_errors_1.default)(400, 'Error: Invalid Email');
    }
    if (!validators.isValidPhone(contactNumber)) {
        throw (0, http_errors_1.default)(400, 'Error: Invalid Phone Number');
    }
    return {
        companyId: (0, uuid_1.v4)(),
        name: companyName,
        abn: companyAbn,
        headquarters: headquarters,
        phone: contactNumber,
        email: companyEmail,
        owner: userId,
        admins: [userId],
        members: [userId],
        invoices: [],
        customers: [],
        itemsList: []
    };
}
function getCompany(companyId) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, dataStore_1.getData)();
        const response = yield data.get({ TableName: "Companies", Key: { companyId: companyId } });
        if (response.Item === undefined) {
            throw (0, http_errors_1.default)(400, 'Error: Company does not exist');
        }
        return response.Item;
    });
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
        fieldsToCheck.forEach((field) => {
            if (typeof item[field] !== 'number') {
                throw (0, http_errors_1.default)(400, `Invalid value for ${field}: ${item[field]} is not a number.`);
            }
            if (item[field] < 0) {
                throw (0, http_errors_1.default)(400, `Invalid value for ${field}: ${item[field]} cannot be negative.`);
            }
        });
    });
};
const validateInvoiceDetailsV2 = (invoiceDetails) => {
    invoiceDetails.items.forEach((item) => {
        const fieldsToCheck = [
            'quantity',
            'discountAmount',
            'totalAmount'
        ];
        fieldsToCheck.forEach((field) => {
            if (typeof item[field] !== 'number') {
                throw (0, http_errors_1.default)(400, `Invalid value for ${field}: ${item[field]} is not a number.`);
            }
            if (item[field] < 0) {
                throw (0, http_errors_1.default)(400, `Invalid value for ${field}: ${item[field]} cannot be negative.`);
            }
        });
    });
};
function generateInvoice(invoiceId, userId, companyId, invoiceDetails) {
    validateInvoiceDetails(invoiceDetails);
    const invoice = {
        invoiceId: invoiceId,
        userId: userId,
        companyId: companyId,
        details: invoiceDetails
    };
    return invoice;
}
function generateInvoiceV2(invoiceId, userId, companyId, invoiceDetails, isDraft) {
    if (!isDraft) {
        validateInvoiceDetailsV2(invoiceDetails);
    }
    const invoice = {
        invoiceId: invoiceId,
        userId: userId,
        companyId: companyId,
        details: invoiceDetails,
        isDraft: isDraft,
    };
    return invoice;
}
function getInvoice(invoiceId) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, dataStore_1.getData)();
        const response = yield data.get({ TableName: "Invoices", Key: { invoiceId: invoiceId } });
        if (response.Item === undefined) {
            throw (0, http_errors_1.default)(400, 'Error: Invoice does not exist');
        }
        return response.Item;
    });
}
function createCustomerV3(name, billingAddress, shippingAddress, email, bankName, bankAccount) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validators.isValidName(name)) {
            throw (0, http_errors_1.default)(400, 'Error: Invalid Name');
        }
        if (!validators.isValidEmail(email)) {
            throw (0, http_errors_1.default)(400, 'Error: Invalid Email');
        }
        return {
            customerId: (0, uuid_1.v4)(),
            name: name,
            billingAddress: billingAddress,
            shippingAddress: shippingAddress,
            email: email,
            bankName: bankName,
            bankAccount: bankAccount
        };
    });
}
function getCustomer(customerId) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, dataStore_1.getData)();
        const response = yield data.get({ TableName: "Customers", Key: { customerId: customerId } });
        if (response.Item === undefined) {
            throw (0, http_errors_1.default)(400, 'Error: Customers does not exist');
        }
        return response.Item;
    });
}
function getCustomerByEmailV3(email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validators.isValidEmail(email)) {
            throw (0, http_errors_1.default)(400, 'Error: Invalid Email');
        }
        const data = (0, dataStore_1.getData)();
        const response = yield data.query({
            TableName: "Customers",
            IndexName: "EmailIndex",
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        });
        return response.Items.length === 0 ? undefined : response.Items[0];
    });
}
function createItemV3(name, sku, description, unitPrice) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validators.isValidName(name)) {
            throw (0, http_errors_1.default)(400, 'Error: Invalid Name');
        }
        const itemExistsAlready = yield getItemBySkuV3(sku);
        if (itemExistsAlready !== undefined) {
            throw (0, http_errors_1.default)(400, 'Error: Item already exists');
        }
        return {
            itemId: (0, uuid_1.v4)(),
            name: name,
            sku: sku,
            description: description,
            unitPrice: unitPrice
        };
    });
}
function getItem(itemId) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, dataStore_1.getData)();
        const response = yield data.get({ TableName: "Items", Key: { itemId: itemId } });
        if (response.Item === undefined) {
            throw (0, http_errors_1.default)(400, 'Error: Item does not exist');
        }
        return response.Item;
    });
}
function getItemBySkuV3(sku) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, dataStore_1.getData)();
        const response = yield data.query({
            TableName: "Items",
            IndexName: "SkuIndex",
            KeyConditionExpression: 'sku = :sku',
            ExpressionAttributeValues: {
                ':sku': sku
            }
        });
        return response.Items.length === 0 ? undefined : response.Items[0];
    });
}
