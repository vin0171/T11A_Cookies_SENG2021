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
Object.defineProperty(exports, "__esModule", { value: true });
const users = __importStar(require("./users"));
const companies = __importStar(require("./companies"));
const invoices = __importStar(require("./invoices"));
const customers = __importStar(require("./customers"));
const items = __importStar(require("./items"));
const emailService = __importStar(require("./emailService"));
const validationHelpers_1 = require("./validationHelpers");
const dataStore_1 = require("./dataStore");
const InvoiceConverter_1 = require("./InvoiceConverter");
const interfaceHelpers_1 = require("./interfaceHelpers");
const validation_1 = require("./validation");
function routes(app) {
    // ========================================================================= //
    // Iteration 1 
    // ========================================================================= //
    app.delete('/v1/clear', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, dataStore_1.resetDataStore)();
            res.status(200).json({});
        }
        catch (err) {
            next(err);
        }
    }));
    app.post('/v1/user/register', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password, nameFirst, nameLast, age } = req.body;
            const response = yield users.registerUser(email, password, nameFirst, nameLast, age);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.post('/v1/user/login', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const response = yield users.userLogin(email, password);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    // app.post('/v1/user/logout', async (req: Request, res: Response, next: NextFunction) => {
    //   try {
    //     const token = req.headers['authorization'].split(' ')[1];
    //     const response = users.userLogout(token);
    //     res.status(200).json(response);
    //   } catch(err) {
    //     next(err);
    //   }
    // });
    app.get('/v1/user/invoices', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const response = yield invoices.listUserInvoices(token);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.post('/v1/company/register', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const { companyName, companyAbn, companyEmail, contactNumber } = req.body;
            const { address, city, state, postcode, country } = req.body;
            const headquarters = (0, validationHelpers_1.validateLocation)(address, city, state, postcode, country);
            const response = yield companies.registerCompany(token, companyName, companyAbn, headquarters, companyEmail, contactNumber);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.post('/v1/company/userAdd', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { companyId, userEmailToAdd } = req.body;
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const response = yield companies.addCompanyUserV3(token, companyId, userEmailToAdd);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.get('/v1/company/:companyId', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const companyId = req.params.companyId;
            const response = yield (0, interfaceHelpers_1.getCompany)(companyId);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.get('/v1/company/:companyId/invoices', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.headers['authorization'].split(' ')[1];
            const companyId = req.params.companyId;
            const response = yield invoices.listCompanyInvoices(token, companyId);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.post('/v1/invoice', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { invoiceDetails } = req.body;
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const response = yield invoices.createInvoice(token, invoiceDetails);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.get('/v1/invoice/:invoiceId', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const contentType = req.headers['accept'].split(' ')[0] || "application/JSON";
            const invoiceId = req.params.invoiceId;
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const response = yield invoices.retrieveInvoice(token, invoiceId);
            if (contentType.includes('application/xml')) {
                const company = yield (0, interfaceHelpers_1.getCompany)(response.companyId);
                const invoiceUBL = new InvoiceConverter_1.InvoiceConverter(response).parseToUBL(company.companyId);
                res.status(200).send(invoiceUBL);
                return;
            }
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.put('/v1/invoice/:invoiceId/edit', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const { invoiceId, edits } = req.body;
            const response = yield invoices.editInvoiceDetails(token, invoiceId, edits);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.post('/v1/invoice/validate', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { ublInvoice } = req.body;
            const response = (0, validation_1.validateUBL)(ublInvoice);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.delete('/v1/invoice/:invoiceId', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const invoiceId = req.params.invoiceId;
            const response = yield invoices.deleteInvoice(token, invoiceId);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    // ========================================================================= //
    // Iteration 2
    // ========================================================================= //
    app.post('/v1/invoice/:invoiceId/pdf', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const invoiceId = req.params.invoiceId;
            console.log('hello??v3');
            // Generate the PDF for the invoice
            const pdfBuffer = yield invoices.generateInvoicePDF(token, invoiceId);
            // Set headers for PDF response
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoiceId}.pdf`);
            console.log('PDF generated successfully😅');
            res.status(200).send(pdfBuffer);
        }
        catch (err) {
            next(err);
        }
    }));
    app.post('/v2/invoice', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { invoiceId, invoiceDetails, isDraft } = req.body;
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const response = yield invoices.createInvoiceV2(token, invoiceId, invoiceDetails, isDraft);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.get('/v1/user/details', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const response = yield (0, validationHelpers_1.validateToken)(token);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    // ========================================================================= //
    // Iteration 3
    // ========================================================================= //
    app.post('/v3/user/register', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password, nameFirst, nameLast } = req.body;
            const response = yield users.registerUserV3(email, password, nameFirst, nameLast);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.post('/v3/user/login', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const response = yield users.userLoginV3(email, password);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.post('/v3/company/register', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const { companyName, companyAbn, companyEmail, contactNumber } = req.body;
            const { address, city, state, postcode, country } = req.body;
            const headquarters = (0, validationHelpers_1.validateLocation)(address, city, state, postcode, country);
            const response = yield companies.registerCompanyV3(token, companyName, companyAbn, headquarters, companyEmail, contactNumber);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.post('/v3/company/userAdd', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { companyId, userEmailToAdd } = req.body;
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const response = yield companies.addCompanyUserV3(token, companyId, userEmailToAdd);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.get('/v3/company/:companyId', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const companyId = req.params.companyId;
            const response = yield (0, interfaceHelpers_1.getCompany)(companyId);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.post('/v3/company/sendEmailReminder', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const emailTo = req.body.emailTo;
            const response = emailService.sendPaymentRequestEmail(token, emailTo);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.get('/v3/user/details', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const response = yield (0, validationHelpers_1.validateToken)(token);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.get('/v3/company/:companyId/invoices', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.headers['authorization'].split(' ')[1];
            const companyId = req.params.companyId;
            const response = yield invoices.listCompanyInvoices(token, companyId);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    //// Invoices 
    app.post('/v3/invoice', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { invoiceDetails, isDraft } = req.body;
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const response = yield invoices.createInvoiceV3(token, invoiceDetails, isDraft);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.get('/v3/invoice/:invoiceId', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const contentType = req.headers['accept'].split(' ')[0] || "application/JSON";
            const invoiceId = req.params.invoiceId;
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const response = yield invoices.retrieveInvoice(token, invoiceId);
            if (contentType.includes('application/xml')) {
                const company = yield (0, interfaceHelpers_1.getCompany)(response.companyId);
                const invoiceUBL = new InvoiceConverter_1.InvoiceConverter(response).parseToUBL(company.companyId);
                res.status(200).send(invoiceUBL);
                return;
            }
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.put('/v3/invoice/:invoiceId/edit', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const { invoiceId, edits } = req.body;
            const response = yield invoices.editInvoiceDetailsV3(token, invoiceId, edits);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.post('/v3/invoice/validate', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { ublInvoice } = req.body;
            const response = (0, validation_1.validateUBL)(ublInvoice);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.delete('/v3/invoice/:invoiceId', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const invoiceId = req.params.invoiceId;
            const response = yield invoices.deleteInvoice(token, invoiceId);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.post('/v3/customer', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const { name, billingAddress, shippingAddress, email, bankName, bankAccount, companyId } = req.body;
            const response = yield customers.registerCustomer(token, name, companyId, billingAddress, shippingAddress, email, bankName, bankAccount);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.post('/v3/item', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const { name, sku, price, description, companyId } = req.body;
            const response = yield items.registerItem(token, companyId, name, sku, price, description);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.get('/v3/company/:companyId/customers', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.headers['authorization'].split(' ')[1];
            const companyId = req.params.companyId;
            const response = yield customers.listCompanyCustomers(token, companyId);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.get('/v3/company/:companyId/items', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.headers['authorization'].split(' ')[1];
            const companyId = req.params.companyId;
            const response = yield items.listCompanyItems(token, companyId);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    }));
    app.post('/v3/invoice/:invoiceId/pdf', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = ((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || undefined;
            const invoiceId = req.params.invoiceId;
            console.log('hello??v3');
            // Generate the PDF for the invoice
            const pdfBuffer = yield invoices.generateInvoicePDFV3(token, invoiceId);
            // Set headers for PDF response
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoiceId}.pdf`);
            console.log('PDF generated successfully😅');
            res.status(200).send(pdfBuffer);
        }
        catch (err) {
            next(err);
        }
    }));
    // We indirectly use next but not directly which causes linting errors
    // eslint-disable-next-line 
    app.use((err, req, res, next) => {
        res.status(err.status || 500).json({ error: err.message });
    });
}
exports.default = routes;
