"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceConverter = void 0;
const xmlbuilder2_1 = require("xmlbuilder2");
const dayjs_1 = __importDefault(require("dayjs"));
const XML_NAMESPACES = {
    xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
    'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
    'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2'
};
class InvoiceConverter {
    constructor(invoice) {
        this.invoice = invoice;
        this.root = (0, xmlbuilder2_1.create)({ version: '1.0' })
            .ele('Invoice', XML_NAMESPACES);
    }
    setID(invoiceId) {
        this.root.ele('cbc:ID').txt(invoiceId);
        return this;
    }
    setInvoicePeriod(issueDate, endDate) {
        const invoicePeriod = this.root.ele('cac:InvoicePeriod');
        invoicePeriod.ele('cbc:IssueDate').txt(issueDate);
        invoicePeriod.ele('cbc:EndDate').txt(endDate);
        return this;
    }
    setCurrency(currency = 'USD') {
        this.root.ele('cbc:DocumentCurrencyCode').txt(currency);
        return this;
    }
    addParties(supplier, consumer) {
        const supplierParty = this.root.ele('cac:AccountingSupplierParty')
            .ele('cac:Party');
        supplierParty.ele('cac:PartyName').ele('cbc:Name').txt(supplier);
        const consumerParty = this.root.ele('cac:AccountingConsumerParty')
            .ele('cac:Party');
        consumerParty.ele('cac:PartyName').ele('cbc.Name').txt(consumer);
        return this;
    }
    addItems(items) {
        items.forEach((item, index) => {
            const itemLines = this.root.ele('cac:InvoiceLine');
            itemLines.ele('cbc:ID').txt((index + 1).toString());
            const cacItem = itemLines.ele('cac:Item');
            Object.entries(item).forEach(([key, value]) => {
                cacItem.ele(`cac:${key}`).txt(value);
            });
        });
        return this;
    }
    create(headless = true) {
        return this.root.end({ prettyPrint: true, headless });
    }
    parseToUBL(companyName) {
        return this
            .setID(this.invoice.invoiceId)
            .setInvoicePeriod((0, dayjs_1.default)(this.invoice.details.issueDate).format('YYYY-MM-DD'), (0, dayjs_1.default)(this.invoice.details.dueDate).format('YYYY-MM-DD'))
            .setCurrency(this.invoice.details.currency)
            .addParties(companyName, this.invoice.details.receiver.companyName)
            .addItems(this.invoice.details.items)
            .create();
    }
}
exports.InvoiceConverter = InvoiceConverter;
