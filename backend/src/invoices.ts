import * as validators from "./validationHelpers"
import { EmptyObject, Invoice, InvoiceDetails, InvoiceState, User } from "./interface";
import { generateInvoice, getInvoice} from "./interfaceHelpers";
import { getData } from "./dataStore";
import {v4 as uuidv4} from 'uuid';
import * as helpers from './helper';


/**
 * Stub for the createInvoice function.
 * 
 * Create an invoice with a given details and return it.
 * 
 * @param {string} token - the token of the current user
 * @param {InvoiceDetails} invoiceDetails - contains all invoice details
 * @returns {string}
 */
export function createInvoice(token: string, invoiceDetails: InvoiceDetails) {
    const user = validators.validateToken(token)
    
    const data = getData();
    const invoiceId = uuidv4();
    const invoiceInfo : Invoice = generateInvoice(invoiceId, user.userId, user.companyId, invoiceDetails);

    data.invoices.push(invoiceInfo)
    user.invoices.push(invoiceInfo)
    // You could definitely make this into a function but i dont WANT to
    if (user.companyId !== null) {
        const company = data.companies.find((c) => c.companyId === user.companyId);
        if (company === null) {
            throw helpers.errorReturn(400, 'Error: Company does not exist'); 
        } 
        company.invoices.push(invoiceInfo);
    }
    return {invoiceId: invoiceInfo.invoiceId};
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
export function retrieveInvoice(token: string, invoiceId: string, contentType: string): Invoice {
    const userInfo: User  = validators.validateToken(token);
	const invoiceInfo: Invoice = validators.validateUsersPerms(userInfo, invoiceId);
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
export function editInvoiceDetails(token: string, invoiceId: string, edits: Partial<InvoiceDetails>): Invoice {
    const user: User  = validators.validateToken(token);
	let invoice: Invoice = validators.validateAdminPerms(user, invoiceId);
    const updatedInvoice = {...invoice, details: {...invoice.details, ...edits}}
    invoice = updatedInvoice
    return updatedInvoice;
}

/** Stub for the deleteInvoice function
 * 
 * Delete an invoice with the given invoice id
 * 
 * @param {string} token - token of the user     
 * @param {number} invoiceId - id of the invoice
 * @returns {null}
 */
export function deleteInvoice(token: string, invoiceId: string) : null {
    const data = getData();
    const userInfo: User  = validators.validateToken(token);
	const invoice: Invoice = validators.validateAdminPerms(userInfo, invoiceId);
    data.invoices.splice(data.invoices.indexOf(invoice), 1)
    // i also need to delete the invoice from the user and the company if they are in one.
    userInfo.invoices.splice(userInfo.invoices.indexOf(invoice), 1)
    if (userInfo.companyId !== null) {
        const company = data.companies.find((c) => c.companyId === userInfo.companyId);
        if (company === null) {
            throw helpers.errorReturn(400, 'Error: Company does not exist'); 
        } 
        company.invoices.splice(company.invoices.indexOf(invoice), 1)
    }
    return null;
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
export function listCompanyInvoices(token: string, companyId: string): Invoice[] {
    const data = getData()
    const user = validators.validateToken(token);
    const company = data.companies.find((c) => c.companyId === companyId);
    if (company === null) {
        throw helpers.errorReturn(400, 'Error: Company does not exist'); 
    } 
    if (user.companyId != company.companyId) {
        throw helpers.errorReturn(403, 'Error: User is not authorised')
    }
    return company.invoices
}


// TODO, list user invoices 
