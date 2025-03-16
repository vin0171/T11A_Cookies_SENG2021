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
exports.createInvoice = createInvoice;
exports.retrieveInvoice = retrieveInvoice;
exports.editInvoiceDetails = editInvoiceDetails;
exports.deleteInvoice = deleteInvoice;
exports.listCompanyInvoices = listCompanyInvoices;
const validators = __importStar(require("./validationHelpers"));
const interfaceHelpers_1 = require("./interfaceHelpers");
const dataStore_1 = require("./dataStore");
const uuid_1 = require("uuid");
const helpers = __importStar(require("./helper"));
/**
 * Stub for the createInvoice function.
 *
 * Create an invoice with a given details and return it.
 *
 * @param {string} token - the token of the current user
 * @param {InvoiceDetails} invoiceDetails - contains all invoice details
 * @returns {string}
 */
function createInvoice(token, invoiceDetails) {
    const user = validators.validateToken(token);
    const data = (0, dataStore_1.getData)();
    const invoiceId = (0, uuid_1.v4)();
    const invoiceInfo = (0, interfaceHelpers_1.generateInvoice)(invoiceId, user.userId, user.companyId, invoiceDetails);
    data.invoices.push(invoiceInfo);
    user.invoices.push(invoiceInfo);
    // You could definitely make this into a function but i dont WANT to
    if (user.companyId !== null) {
        const company = data.companies.find((c) => c.companyId === user.companyId);
        if (company === null) {
            throw helpers.errorReturn(400, 'Error: Company does not exist');
        }
        company.invoices.push(invoiceInfo);
    }
    return { invoiceId: invoiceInfo.invoiceId };
}
/**
 * Stub for the getInvoice function.
 *
 * Return an invoice with the given invoice id and content type.
 * @param {string} token - the token of the current user
 * @param {string} invoiceId -  the id of the invoice we want to retrieve
 * @param {string} contentType - the type we want the invoice to be returned as (json or xml)
 *
 * @returns {String | Invoice}
 */
function retrieveInvoice(token, invoiceId, contentType) {
    const userInfo = validators.validateToken(token);
    const invoiceInfo = validators.validateUsersPerms(userInfo, invoiceId);
    return invoiceInfo;
}
/**
 * Stub for the editInvoiceDetails function.
 *
 * Edit the details of an invoice with the given parameters and return the invoice.
 *
 * @param {string} token - the token of the current user
 * @param {Invoice} invoiceId - the id of the invoice to be edited
 * @param {InvoiceDetails} edits - the updated details of the invoice
 * @returns {Invoice}
 */
function editInvoiceDetails(token, invoiceId, edits) {
    const user = validators.validateToken(token);
    let invoice = validators.validateAdminPerms(user, invoiceId);
    const updatedInvoice = { ...invoice, details: { ...invoice.details, ...edits } };
    invoice = updatedInvoice;
    return {};
}
/** Stub for the deleteInvoice function
 *
 * Delete an invoice with the given invoice id
 *
 * @param {string} token - token of the user
 * @param {number} invoiceId - id of the invoice
 * @returns {null}
 */
function deleteInvoice(token, invoiceId) {
    const data = (0, dataStore_1.getData)();
    const userInfo = validators.validateToken(token);
    const invoice = validators.validateAdminPerms(userInfo, invoiceId);
    data.invoices.splice(data.invoices.indexOf(invoice), 1);
    // i also need to delete the invoice from the user and the company if they are in one.
    userInfo.invoices.splice(userInfo.invoices.indexOf(invoice), 1);
    if (userInfo.companyId !== null) {
        const company = data.companies.find((c) => c.companyId === userInfo.companyId);
        if (company === null) {
            throw helpers.errorReturn(400, 'Error: Company does not exist');
        }
        company.invoices.splice(company.invoices.indexOf(invoice), 1);
    }
    return {};
}
/** Stub for the listCompanyInvoices function
 *
 * Returns a list of every invoice in a given company.
 *
 * @param {string} token - token of the user
 * @param {string} companyId - the id of the company
 * @returns {Invoice[]}
 *
*/
function listCompanyInvoices(token, companyId) {
    const data = (0, dataStore_1.getData)();
    const user = validators.validateToken(token);
    const company = data.companies.find((c) => c.companyId === companyId);
    if (company === null) {
        throw helpers.errorReturn(400, 'Error: Company does not exist');
    }
    if (user.companyId != company.companyId) {
        throw helpers.errorReturn(403, 'Error: User is not authorised');
    }
    return company.invoices.map(invoice => invoice.invoiceId);
}
// TODO, list user invoices 
