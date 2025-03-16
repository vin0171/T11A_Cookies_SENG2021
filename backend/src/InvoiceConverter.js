"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceConverter = void 0;
const xmlbuilder2_1 = require("xmlbuilder2");
const interface_1 = require("./interface");
const invoiceDetails = {
    "invoiceId": "INV-20250310-001",
    "userId": "user-123",
    "companyId": "company-456",
    "details": {
        "sender": {
            "companyName": "Magic Solutions Ltd.",
            "address": "123 Wizard Street, Spell City",
            "country": "US",
            "phone": "+1-555-7890",
            "email": "info@magicsolutions.com",
            "taxIdentificationNumber": "US-TAX-987654",
            "bankName": "Mystic Bank",
            "bankAccount": "987654321",
            "iban": "US29MYST98765432100001",
            "swift": "MYSTUS33",
            "website": "https://magicsolutions.com",
            "logo": "https://magicsolutions.com/logo.png"
        },
        "receiver": {
            "companyName": "Enchanted Goods LLC",
            "address": "456 Sorcery Lane, Potion Town",
            "country": "GB",
            "phone": "+44-203-123456",
            "email": "contact@enchantedgoods.co.uk",
            "taxIdentificationNumber": "GB-VAT-123456789",
            "bankName": "Alchemy Bank",
            "bankAccount": "123456789",
            "iban": "GB99ALCH12345678900002",
            "swift": "ALCHGB22"
        },
        "issueDate": 1710028800,
        "dueDate": 1712630400,
        "repeating": false,
        "status": interface_1.InvoiceStatus.PAID,
        "state": interface_1.InvoiceState.MAIN,
        "items": [
            {
                "itemSku": "WAND-001",
                "itemName": "Elder Wand",
                "description": "A powerful wand infused with ancient magic.",
                "quantity": 2,
                "unitPrice": 250.00,
                "discountAmount": 0.00,
                "taxAmount": 50.00,
                "taxRate": 10,
                "totalAmount": 550.00
            },
            {
                "itemSku": "POT-002",
                "itemName": "Healing Potion",
                "description": "Restores full health upon consumption.",
                "quantity": 5,
                "unitPrice": 30.00,
                "discountAmount": 0.00,
                "taxAmount": 15.00,
                "taxRate": 10,
                "totalAmount": 165.00
            }
        ],
        "currency": "USD",
        "total": 715.00,
        "notes": "Payment due within 30 days.",
        "terms": "No refunds after 14 days."
    }
};
const details2 = {
    "invoiceId": "INV-123456",
    "userId": "USR-123456",
    "companyId": "CMPY-321321",
    "details": {
        "sender": {
            "companyName": "Turples Industry Inc.",
            "address": "100 Orbilvion Street",
            "country": "Australia",
            "phone": "+31 23123 323",
            "email": "realEmail@gmail.com",
            "taxIdentificationNumber": "2313123213123",
            "bankName": "Commonwealth Bank",
            "bankAccount": "123-356",
            "iban": "AT611904300234573201",
            "swift": "AAAA BB CC DDD",
            "website": "website.com.au",
            "logo": "Falcon.IO",
            "notes": "Slightly damaged on border"
        },
        "receiver": {
            "companyName": "Turples Industry Inc.",
            "address": "100 Orbilvion Street",
            "country": "Australia",
            "phone": "+31 23123 323",
            "email": "realEmail@gmail.com",
            "taxIdentificationNumber": "2313123213123",
            "bankName": "Commonwealth Bank",
            "bankAccount": "123-356",
            "iban": "AT611904300234573201",
            "swift": "AAAA BB CC DDD",
            "website": "website.com.au",
            "logo": "Falcon.IO",
            "notes": "Slightly damaged on border"
        },
        "issueDate": 32434242,
        "dueDate": 31232131,
        "repeating": true,
        "status": interface_1.InvoiceStatus.DRAFT,
        "state": interface_1.InvoiceState.MAIN,
        "items": [
            {
                "itemSku": "SKU12345",
                "itemName": "Wireless Keyboard",
                "description": "Ergonomic wireless keyboard with backlight",
                "quantity": 2,
                "unitPrice": 50,
                "discountAmount": 5,
                "taxAmount": 4.5,
                "taxRate": 0.09,
                "totalAmount": 99.5
            }
        ],
        "currency": "AUD",
        "total": 2133123122,
        "notes": "Slightly damaged on border",
        "terms": "15 percent off if paid within 2 days"
    }
};
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
            itemLines.ele('cbc:ID').txt(index + 1);
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
    parseToUBL() {
        return this
            .setID(this.invoice.invoiceId)
            .setInvoicePeriod(this.invoice.details.issueDate.toString(), this.invoice.details.dueDate.toString())
            .setCurrency(this.invoice.details.currency)
            .addParties(this.invoice.details.sender.companyName, this.invoice.details.receiver.companyName)
            .addItems(this.invoice.details.items)
            .create();
    }
}
exports.InvoiceConverter = InvoiceConverter;
// const invoices = new InvoiceConverter(details2).parseToUBL();
// console.log(invoices);
