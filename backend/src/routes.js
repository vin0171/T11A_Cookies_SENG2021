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
const invoices = __importStar(require("./invoices"));
const companies = __importStar(require("./companies"));
const users = __importStar(require("./users"));
const dataStore_1 = require("./dataStore");
const validationHelpers_1 = require("./validationHelpers");
const InvoiceConverter_1 = require("./InvoiceConverter");
// import errorHandler from 'middleware-http-errors';
function routes(app) {
    // ========================================================================= //
    // Iteration 1 
    // ========================================================================= //
    app.delete('/v1/clear', async (req, res, next) => {
        (0, dataStore_1.setData)({
            companies: [],
            users: [],
            invoices: []
        });
        res.status(200).json({});
    });
    app.post('/v1/user/register', async (req, res, next) => {
        try {
            const { email, password, nameFirst, nameLast, age } = req.body;
            const response = users.registerUser(email, password, nameFirst, nameLast, age);
            res.status(200).json({ token: response });
            (0, dataStore_1.saveDataStore)();
        }
        catch (err) {
            next(err);
        }
    });
    app.post('/v1/user/login', async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const token = users.userLogin(email, password);
            res.status(200).json({ token: token });
            (0, dataStore_1.saveDataStore)();
        }
        catch (err) {
            next(err);
        }
    });
    app.post('/v1/user/logout', async (req, res, next) => {
        try {
            const token = req.headers['authorization'].split(' ')[1];
            const response = users.userLogout(token);
            res.status(200).json(response);
            (0, dataStore_1.saveDataStore)();
        }
        catch (err) {
            next(err);
        }
    });
    app.post('/v1/company/register', async (req, res, next) => {
        try {
            const token = req.headers['authorization'].split(' ')[1];
            const { companyName, companyAbn, companyEmail, contactNumber } = req.body;
            const { address, city, state, postcode, country } = req.body;
            const headquarters = (0, validationHelpers_1.validateLocation)(address, city, state, postcode, country);
            const companyId = companies.registerCompany(token, companyName, companyAbn, headquarters, companyEmail, contactNumber);
            res.status(200).json({ companyId: companyId });
            (0, dataStore_1.saveDataStore)();
        }
        catch (err) {
            next(err);
        }
    });
    app.post('/v1/company/userAdd', async (req, res, next) => {
        try {
            const { companyId, userEmailToAdd } = req.body;
            const token = req.headers['authorization'].split(' ')[1];
            const response = companies.addCompanyUser(token, companyId, userEmailToAdd);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    });
    app.get('/v1/company/:companyId/invoices', async (req, res, next) => {
        try {
            const token = req.headers['authorization'].split(' ')[1];
            const companyId = req.params.companyId;
            const response = invoices.listCompanyInvoices(token, companyId);
            res.status(200).json({ invoices: response });
        }
        catch (err) {
            next(err);
        }
    });
    app.post('/v1/invoice', async (req, res, next) => {
        try {
            const invoiceDetails = req.body;
            const token = req.headers['authorization'].split(' ')[1];
            const response = invoices.createInvoice(token, invoiceDetails);
            res.status(200).json(response);
            (0, dataStore_1.saveDataStore)();
        }
        catch (err) {
            next(err);
        }
    });
    app.get('/v1/invoice/:invoiceId', async (req, res, next) => {
        try {
            const contentType = req.headers['accept'].split(' ')[0];
            const invoiceId = req.params.invoiceId;
            const token = req.headers['authorization'].split(' ')[1];
            const response = invoices.retrieveInvoice(token, invoiceId, contentType);
            if (contentType.includes('application/xml')) {
                const invoiceUBL = new InvoiceConverter_1.InvoiceConverter(response).parseToUBL();
                res.status(200).send(invoiceUBL);
                return;
            }
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    });
    app.put('/v1/invoice/:invoiceId/edit', async (req, res, next) => {
        try {
            const token = req.headers['authorization'].split(' ')[1];
            const { invoiceId, edits } = req.body;
            const response = invoices.editInvoiceDetails(token, invoiceId, edits);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    });
    app.delete('/v1/invoice/:invoiceId', async (req, res, next) => {
        try {
            const token = req.headers['authorization'].split(' ')[1];
            const invoiceId = req.params.invoiceId;
            const response = invoices.deleteInvoice(token, invoiceId);
            res.status(200).json(response);
        }
        catch (err) {
            next(err);
        }
    });
    app.use((err, req, res, next) => {
        res.status(err.status || 500).json({ error: err.message });
    });
}
exports.default = routes;
