"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readInvoices = readInvoices;
const xmldom_1 = require("xmldom");
const xpath_1 = __importDefault(require("xpath"));
function selectSingleNode(select, xpathExpr, xmlDoc, label, required = false) {
    const rawResult = select(xpathExpr, xmlDoc);
    if (!Array.isArray(rawResult)) {
        throw new Error(`${label} must be a node list, but got ${typeof rawResult}`);
    }
    const nodes = rawResult;
    if (nodes.length > 1) {
        throw new Error(`${label} must occur at most once, but ${nodes.length} were found.`);
    }
    if (required && nodes.length === 0) {
        throw new Error(`${label} is required but not found.`);
    }
    return nodes[0] || null;
}
function readInvoices(invoiceXML) {
    var _a, _b;
    const parser = new xmldom_1.DOMParser();
    const xmlDoc = parser.parseFromString(invoiceXML, "application/xml");
    const result = {
        invoiceId: '',
        issueDate: '',
        invoicePeriod: {
            startDate: '',
            endDate: ''
        },
        supplier: {
            name: ''
        },
        customer: {
            name: ''
        },
        payableAmount: '',
        currencyID: '',
        items: []
    };
    const select = xpath_1.default.useNamespaces({
        ubl: "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
        cac: "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
        cbc: "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
    });
    const getText = (node) => node ? (node.nodeValue || "").trim() : "";
    try {
        result.invoiceId = getText(selectSingleNode(select, "/ubl:Invoice/cbc:ID/text()", xmlDoc, "Invoice ID"));
        result.issueDate = getText(selectSingleNode(select, "//cbc:IssueDate/text()", xmlDoc, "Issue Date"));
        const invoicePeriod = selectSingleNode(select, "//cac:InvoicePeriod", xmlDoc, "Invoice Period");
        if (invoicePeriod) {
            result.invoicePeriod.startDate = getText(selectSingleNode(select, "cbc:StartDate/text()", invoicePeriod, "Start Date"));
            result.invoicePeriod.endDate = getText(selectSingleNode(select, "cbc:EndDate/text()", invoicePeriod, "End Date"));
        }
        const supplierParty = selectSingleNode(select, "//cac:AccountingSupplierParty/cac:Party", xmlDoc, "Supplier Party");
        result.supplier.name = getText(selectSingleNode(select, "cac:PartyName/cbc:Name/text()", supplierParty, "Supplier Name"));
        const customerParty = selectSingleNode(select, "//cac:AccountingCustomerParty/cac:Party", xmlDoc, "Customer Party");
        result.customer.name = getText(selectSingleNode(select, "cac:PartyName/cbc:Name/text()", customerParty, "Customer Name"));
        const legalMonetaryTotal = selectSingleNode(select, "//cac:LegalMonetaryTotal", xmlDoc, "Legal Monetary Total");
        const payableAmountElement = selectSingleNode(select, "cbc:PayableAmount", legalMonetaryTotal, "Payable Amount");
        result.payableAmount = ((_a = payableAmountElement === null || payableAmountElement === void 0 ? void 0 : payableAmountElement.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || "";
        result.currencyID = (payableAmountElement === null || payableAmountElement === void 0 ? void 0 : payableAmountElement.getAttribute("currencyID")) || "";
        const invoiceLines = select("//cac:InvoiceLine", xmlDoc);
        for (const line of invoiceLines) {
            const lineId = getText(selectSingleNode(select, "cbc:ID/text()", line, "Line ID"));
            const amountElement = selectSingleNode(select, "cbc:LineExtensionAmount", line, "Line Amount");
            const lineAmount = ((_b = amountElement === null || amountElement === void 0 ? void 0 : amountElement.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "";
            const lineCurrency = (amountElement === null || amountElement === void 0 ? void 0 : amountElement.getAttribute("currencyID")) || "";
            const item = selectSingleNode(select, "cac:Item", line, "Item");
            const itemName = getText(selectSingleNode(select, "cbc:Name/text()", item, "Item Name"));
            const itemDescription = getText(selectSingleNode(select, "cbc:Description/text()", item, "Item Description"));
            result.items.push({
                id: lineId,
                currency: lineCurrency,
                unitPrice: lineAmount,
                itemName: itemName,
                description: itemDescription
            });
        }
    }
    catch (error) {
        console.error("⚠️ Error parsing XML:", error.message);
    }
    return result;
}
