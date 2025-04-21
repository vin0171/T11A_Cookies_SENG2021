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
exports.createInvoice = createInvoice;
exports.createInvoiceV2 = createInvoiceV2;
exports.createInvoiceV3 = createInvoiceV3;
exports.retrieveInvoice = retrieveInvoice;
exports.editInvoiceDetails = editInvoiceDetails;
exports.editInvoiceDetailsV3 = editInvoiceDetailsV3;
exports.deleteInvoice = deleteInvoice;
exports.listCompanyInvoices = listCompanyInvoices;
exports.listUserInvoices = listUserInvoices;
exports.generateInvoicePDF = generateInvoicePDF;
exports.generateInvoicePDFV3 = generateInvoicePDFV3;
exports.generateInvoiceXML = generateInvoiceXML;
const validators = __importStar(require("./validationHelpers"));
const interfaceHelpers_1 = require("./interfaceHelpers");
const dataStore_1 = require("./dataStore");
const uuid_1 = require("uuid");
const http_errors_1 = __importDefault(require("http-errors"));
const pdfmake_1 = __importDefault(require("pdfmake"));
const xmlbuilder2_1 = require("xmlbuilder2");
const dayjs_1 = __importDefault(require("dayjs"));
const fonts = {
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
    }
};
const printer = new pdfmake_1.default(fonts);
/**
 * Stub for the createInvoice function.
 *
 * Create an invoice with a given details and return it.
 *
 * @param {string} token - the token of the current user
 * @param {InvoiceDetails} invoiceDetails - contains all invoice details
 * @returns {string}
 */
// ! DEPRECATED
function createInvoice(token, invoiceDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield validators.validateToken(token);
        const data = (0, dataStore_1.getData)();
        const invoiceId = (0, uuid_1.v4)();
        const invoiceInfo = (0, interfaceHelpers_1.generateInvoice)(invoiceId, user.userId, user.companyId, invoiceDetails);
        yield data.put({ TableName: "Invoices", Item: invoiceInfo });
        yield addInvoiceIdToTable("Users", user.userId, invoiceId);
        if (user.companyId !== null) {
            yield addInvoiceIdToTable("Companies", user.companyId, invoiceId);
        }
        return invoiceInfo.invoiceId;
    });
}
/**
 * Stub for the createInvoicev2 function.
 *
 * Create an invoice with a given details and return it (Version 2).
 *
 * @param {string} token - the token of the current user
 * @param {string} invoiceId - the id for the invoice
 * @param {InvoiceDetails} invoiceDetails - contains all invoice details
 * @param {boolean} isDraft - states whether the invoice is a draft or not
 * @returns {string}
 */
// ! DEPRECATED
function createInvoiceV2(token, invoiceId, invoiceDetails, isDraft) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield validators.validateToken(token);
        const data = (0, dataStore_1.getData)();
        const invoiceInfo = (0, interfaceHelpers_1.generateInvoiceV2)(invoiceId, user.userId, user.companyId, invoiceDetails, isDraft);
        yield data.put({ TableName: "Invoices", Item: invoiceInfo });
        yield addInvoiceIdToTable("Users", user.userId, invoiceId);
        if (user.companyId !== null) {
            yield addInvoiceIdToTable("Companies", user.companyId, invoiceId);
        }
        return invoiceInfo.invoiceId;
    });
}
function createInvoiceV3(token, invoiceDetails, isDraft) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield validators.validateToken(token);
        const data = (0, dataStore_1.getData)();
        const invoiceId = (0, uuid_1.v4)();
        const invoiceInfo = (0, interfaceHelpers_1.generateInvoiceV2)(invoiceId, user.userId, user.companyId, invoiceDetails, isDraft);
        yield data.put({ TableName: "Invoices", Item: invoiceInfo });
        if (user.companyId !== null) {
            yield addInvoiceIdToTable("Companies", user.companyId, invoiceId);
        }
        return invoiceInfo.invoiceId;
    });
}
// TODO: fix the two functions below if you want (Hashmap of name to object? idk)
// and also i dont use this in other functions so um 
function keyIdentifer(tableName, primaryKeyIdentifer) {
    if (tableName === "Companies")
        return { companyId: primaryKeyIdentifer };
    if (tableName === "Invoices")
        return { invoiceId: primaryKeyIdentifer };
    return { userId: primaryKeyIdentifer };
}
function addInvoiceIdToTable(tableName, primaryKeyIdentifer, invoiceId) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, dataStore_1.getData)();
        yield data.update({
            TableName: tableName,
            Key: keyIdentifer(tableName, primaryKeyIdentifer),
            UpdateExpression: 'SET invoices = list_append(invoices, :invoiceId)',
            ExpressionAttributeValues: { ':invoiceId': [invoiceId] }
        });
    });
}
/**
 * Stub for the getInvoice function.
 *
 * Return an invoice with the given invoice id and content type.
 * @param {string} token - the token of the current user
 * @param {string} invoiceId -  the id of the invoice we want to retrieve
 */
function retrieveInvoice(token, invoiceId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield validators.validateToken(token);
        const invoiceInfo = yield validators.validateUsersPerms(user.userId, user.companyId, invoiceId);
        return invoiceInfo;
    });
}
/**
 * Stub for the editInvoiceDetails function.
 *
 * Edit the details of an invoice with the given parameters and return the invoice.
 *
 * @param {string} token - the token of the current user
 * @param {Invoice} invoiceId - the id of the invoice to be edited
 * @param {InvoiceDetails} edits - the updated details of the invoice
 */
function editInvoiceDetails(token, invoiceId, edits) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield validators.validateToken(token);
        const invoice = yield validators.validateAdminPerms(user.userId, user.companyId, invoiceId);
        Object.assign(invoice.details, edits);
        const data = (0, dataStore_1.getData)();
        yield data.update({
            TableName: "Invoices",
            Key: keyIdentifer("Invoices", invoiceId),
            UpdateExpression: 'SET details = :invoiceDetailsNew',
            ExpressionAttributeValues: { ':invoiceDetailsNew': invoice.details }
        });
        return invoice;
    });
}
function editInvoiceDetailsV3(token, invoiceId, edits) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield validators.validateToken(token);
        const invoice = yield validators.validateAdminPerms(user.userId, user.companyId, invoiceId);
        Object.assign(invoice.details, edits);
        const data = (0, dataStore_1.getData)();
        yield data.update({
            TableName: "Invoices",
            Key: keyIdentifer("Invoices", invoiceId),
            UpdateExpression: 'SET details = :invoiceDetailsNew',
            ExpressionAttributeValues: { ':invoiceDetailsNew': invoice.details }
        });
        return invoice;
    });
}
// TODO: This function is very simialr to the insert just so yk
// DO NOT USE THIS FUNCTION WITH TABLENAME: INVOICES
function removeInvoiceIdFromTable(tableName, primaryKeyIdentifer, invoiceIdToRemove, invoiceList) {
    return __awaiter(this, void 0, void 0, function* () {
        const newInvoiceList = invoiceList.filter((invId) => invId !== invoiceIdToRemove);
        const data = (0, dataStore_1.getData)();
        yield data.update({
            TableName: tableName,
            Key: keyIdentifer(tableName, primaryKeyIdentifer),
            UpdateExpression: 'SET invoices = :newInvoiceList',
            ExpressionAttributeValues: { ':newInvoiceList': newInvoiceList }
        });
    });
}
/** Stub for the deleteInvoice function
 *
 * Delete an invoice with the given invoice id
 *
 * @param {string} token - token of the user
 * @param {number} invoiceId - id of the invoice
 */
function deleteInvoice(token, invoiceId) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, dataStore_1.getData)();
        const user = yield validators.validateToken(token);
        const invoice = yield validators.validateAdminPerms(user.userId, user.companyId, invoiceId);
        const company = yield (0, interfaceHelpers_1.getCompany)(user.companyId);
        const invoiceIdToRemove = invoice.invoiceId;
        yield data.delete({ TableName: "Invoices", Key: { invoiceId: invoiceIdToRemove } });
        yield removeInvoiceIdFromTable("Users", user.userId, invoiceIdToRemove, user.invoices);
        if (user.companyId !== null) {
            yield removeInvoiceIdFromTable("Companies", user.companyId, invoiceIdToRemove, company.invoices);
        }
        return {};
    });
}
function getInvoiceList(invoiceList) {
    return __awaiter(this, void 0, void 0, function* () {
        const invoiceMap = invoiceList.map((inv) => ({ invoiceId: inv }));
        if (invoiceList.length === 0)
            return invoiceList;
        const data = (0, dataStore_1.getData)();
        const response = yield data.batchGet({
            RequestItems: { Invoices: { Keys: invoiceMap } }
        });
        return response.Responses.Invoices;
    });
}
/** Stub for the listCompanyInvoices function
 *
 * Returns a list of every invoice in a given company.
 *
 * @param {string} token - token of the user
 * @param {string} companyId - the id of the company
 *
*/
function listCompanyInvoices(token, companyId) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, dataStore_1.getData)();
        const user = yield validators.validateToken(token);
        const company = yield (0, interfaceHelpers_1.getCompany)(companyId);
        if (user.companyId != company.companyId) {
            throw (0, http_errors_1.default)(403, 'Error: User is not authorised');
        }
        return getInvoiceList(company.invoices);
    });
}
// /** Stub for the listUsersInvoices function 
//  * 
//  * Returns a list of every invoice for a given user.
//  * 
//  * @param {string} token - token of the user 
//  * @returns {Invoice[]}
//  * 
// */
function listUserInvoices(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield validators.validateToken(token);
        return getInvoiceList(user.invoices);
    });
}
function generateInvoicePDF(token, invoiceId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('HELLOOOOOOOOOOOO');
        const data = (0, dataStore_1.getData)();
        const user = yield validators.validateToken(token);
        const invoice = yield validators.validateAdminPerms(user.userId, user.companyId, invoiceId);
        const company = yield (0, interfaceHelpers_1.getCompany)(user.companyId);
        const response = yield data.get({ TableName: "Invoices", Key: { invoiceId: invoice.invoiceId } });
        const item1 = response.Item;
        // idk error code lol
        console.log(item1);
        if (!item1)
            (0, http_errors_1.default)(403, 'Error: Invoice does not exist');
        //const pdf = await generatePDF(item);
        const item = item1.details;
        const receiverAddress = [
            item.receiver.billingAddress.addressLine1,
            item.receiver.billingAddress.addressLine2,
            item.receiver.billingAddress.suburb,
            item.receiver.billingAddress.state,
            item.receiver.billingAddress.postcode,
            item.receiver.billingAddress.country,
        ].filter(part => part).join(', ');
        console.log(typeof (item.items[0].quantity));
        const docDefinition = {
            content: [
                { text: 'Invoice', style: 'header' },
                {
                    columns: [
                        { text: `From:\n${company.name}\n${company.headquarters.address}`, width: '50%' },
                        { text: `To:\n${item.receiver.name}\n${receiverAddress}`, width: '50%', alignment: 'right' },
                    ]
                },
                { text: `Invoice #: ${item.invoiceNumber || invoiceId}`, margin: [0, 10] },
                { text: `Issue Date: ${new Date(item.issueDate).toLocaleDateString()}` },
                { text: `Due Date: ${new Date(item.dueDate).toLocaleDateString()}` },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['*', 'auto', 'auto', 'auto'],
                        body: [
                            ['Description', 'Qty', 'Unit Price', 'Total'],
                            ...item.items
                                // ?????
                                .filter((i) => i.quantity != 0)
                                .map((i) => [
                                i.itemDetails.description,
                                i.quantity,
                                `${item.currency} ${i.itemDetails.unitPrice}`,
                                `${item.currency} ${i.quantity * i.itemDetails.unitPrice}`
                            ]),
                            [
                                { text: 'Total', colSpan: 3, alignment: 'right' }, {}, {},
                                `${item.currency} ${item.subtotal.toFixed(2)} ${item.total.toFixed(2)}`
                            ]
                        ]
                    },
                    layout: 'lightHorizontalLines',
                    margin: [0, 20]
                },
                item.notes ? { text: `Notes: ${item.notes}` } : null,
            ],
            // defaultStyle: {
            //   font: "Helvetica"
            // },
            styles: {
                header: { fontSize: 22, bold: true, margin: [0, 0, 0, 10] },
                tableExample: { margin: [0, 5, 0, 15] }
            }
        };
        return docDefinition;
    });
}
function twoDecimal(num) {
    if (typeof num === 'string') {
        num = parseFloat(num);
    }
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
}
function generateInvoicePDFV3(token, invoiceId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const data = (0, dataStore_1.getData)();
        const user = yield validators.validateToken(token);
        const invoice = yield validators.validateAdminPerms(user.userId, user.companyId, invoiceId);
        const company = yield (0, interfaceHelpers_1.getCompany)(user.companyId);
        const response = yield data.get({ TableName: "Invoices", Key: { invoiceId: invoice.invoiceId } });
        const invoiceItem = response.Item;
        if (!invoiceItem)
            throw (0, http_errors_1.default)(403, 'Error: Invoice does not exist');
        console.log("😭");
        console.log(invoiceItem);
        const item = invoiceItem.details;
        const receiver = item.receiver;
        console.log("v3");
        console.log(item.items[0].itemDetails.description);
        const receiverAddress = [
            (_a = receiver.billingAddress) === null || _a === void 0 ? void 0 : _a.addressLine1,
            (_b = receiver.billingAddress) === null || _b === void 0 ? void 0 : _b.addressLine2,
        ].filter(Boolean).join(", ");
        const receiverAddress2 = [
            (_c = receiver.billingAddress) === null || _c === void 0 ? void 0 : _c.suburb,
            (_d = receiver.billingAddress) === null || _d === void 0 ? void 0 : _d.state,
            (_e = receiver.billingAddress) === null || _e === void 0 ? void 0 : _e.postcode,
        ].filter(Boolean).join(", ");
        const itemsTable = item.items
            .filter((i) => i.quantity !== 0)
            .map((i) => [
            i.itemDetails.itemName,
            i.itemDetails.description,
            i.quantity,
            `${item.currency} ${i.itemDetails.unitPrice}`,
            `${item.currency} ${(i.quantity * i.itemDetails.unitPrice)}`
        ]);
        const totalsSection = [
            [
                { text: 'Subtotal', colSpan: 4, alignment: 'right' }, {}, {}, {},
                `${item.currency} ${twoDecimal(item.subtotal)}`
            ],
            item.wideDiscount ? [
                { text: 'Discount', colSpan: 4, alignment: 'right' }, {}, {}, {},
                // if item.wideDiscount.discountType === 'percentage' then show it as a percentage else show it as a dollar amount
                { text: `${item.wideDiscount.discountType === 'Percentage' ? item.wideDiscount.discountAmount + "%" : "$" + twoDecimal(item.wideDiscount.discountAmount)}`, alignment: 'right' },
            ] : null,
            ((_f = item.tax) === null || _f === void 0 ? void 0 : _f.taxAmount) ? [
                { text: `Tax (${item.tax.taxType})`, colSpan: 4, alignment: 'right' }, {}, {}, {},
                { text: `${item.tax.taxAmount + "%"}`, alignment: 'right' }
            ] : null,
            ((_g = item.shippingCostDetails) === null || _g === void 0 ? void 0 : _g.shippingCost) ? [
                { text: 'Shipping', colSpan: 4, alignment: 'right' }, {}, {}, {},
                `${item.currency} ${twoDecimal(item.shippingCostDetails.shippingCost)}`
            ] : null,
            [
                { text: 'Total', colSpan: 4, alignment: 'right', bold: true }, {}, {}, {},
                { text: `${item.currency} ${twoDecimal(item.total)}`, bold: true }
            ]
        ].filter(Boolean);
        const docDefinition = {
            content: [
                { text: 'Invoice', style: 'header' },
                {
                    columns: [
                        { text: `From:\n${company.name}\n\n${company.headquarters.address}`, width: '50%' },
                        { text: `To:\n${receiver.name}\n\n${receiverAddress}\n${receiverAddress2}\n${(_h = receiver.billingAddress) === null || _h === void 0 ? void 0 : _h.country}`, width: '50%', alignment: 'right' },
                    ]
                },
                { text: `Invoice #: ${item.invoiceNumber || invoiceId}`, margin: [0, 10, 0, 2] },
                { text: `Issue Date: ${(0, dayjs_1.default)(item.issueDate).format('DD/MM/YYYY')}` },
                { text: `Due Date: ${(0, dayjs_1.default)(item.dueDate).format('DD/MM/YYYY')}` },
                {
                    style: 'tableExample',
                    table: {
                        widths: ['auto', '*', 'auto', 'auto', 'auto'],
                        body: [
                            ['Name', 'Description', 'Qty', 'Unit Price', 'Total'],
                            ...itemsTable,
                            [{ text: '', colSpan: 4, margin: [0, 10] }, {}, {}, {}, {}],
                            ...totalsSection
                        ]
                    },
                    layout: 'lightHorizontalLines',
                    margin: [0, 20]
                },
                { text: `Notes: ${item.notes ? item.notes : ""}`, margin: [0, 10, 0, 0] },
            ],
            styles: {
                header: { fontSize: 22, bold: true, margin: [0, 0, 0, 10] },
                tableExample: { margin: [0, 5, 0, 15] }
            }
        };
        console.log(docDefinition);
        return docDefinition;
    });
}
function generateInvoiceXML(token, invoiceId) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = (0, dataStore_1.getData)();
        const user = yield validators.validateToken(token);
        const invoice = yield validators.validateAdminPerms(user.userId, user.companyId, invoiceId);
        const response = yield data.get({ TableName: "Invoices", Key: { invoiceId: invoice.invoiceId } });
        const item1 = response.Item;
        // idk error code lol
        if (!item1)
            (0, http_errors_1.default)(403, 'Error: Invoice does not exist');
        //const pdf = await generatePDF(item);
        const item = item1.details;
        const invoiceToXML = (invoice) => {
            const xml = (0, xmlbuilder2_1.create)({ version: '1.0' })
                .ele('Invoice')
                .ele('Receiver').txt(item.receiver.company).up()
                .ele('IssueDate').txt(new Date(item.issueDate).toISOString()).up()
                .ele('DueDate').txt(new Date(item.dueDate).toISOString()).up()
                .ele('Status').txt(invoice.status).up()
                .ele('State').txt(invoice.state).up()
                .ele('Currency').txt(item.currency).up()
                .ele('Total').txt(item.total).up()
                .ele('Notes').txt(item.notes || '').up()
                .ele('Items');
            for (const item of invoice.items) {
                xml
                    .ele('Item')
                    .ele('Description').txt(item.itemDetails.description).up()
                    .ele('Quantity').txt(item.quantity.toString()).up()
                    .ele('UnitPrice').txt(String(item.itemDetails.unitPrice)).up()
                    .ele('Total').txt(String(invoice.total)).up()
                    .up();
            }
            return xml.end({ prettyPrint: true });
        };
        return invoiceToXML(item);
    });
}
// ========================================================================= //
// New Stuff
// ========================================================================= //
