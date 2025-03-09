import * as validators from "./validationHelpers"
import { EmptyObject, Invoice, InvoiceDetails, InvoiceState, User } from "./interface";
import { getInvoice } from "./interfaceHelpers";
import { getData } from "./dataStore";
import {v4 as uuidv4} from 'uuid';


/**
 * Stub for the createInvoice function.
 * 
 * Create an invoice with a sender, receiver, issue date, and due date,
 * then returns the invoice
 * 
 * @param {string} token - the token of the current user
 * @param {InvoiceDetails} invoiceDetails - contains all invoice details
 * @returns {string}
 */
export function createInvoice(token: string, invoiceDetails: InvoiceDetails): Invoice {
    const user = validators.validateToken(token)
    const data = getData();
    const invoiceId = uuidv4();
    const invoice = {
        invoiceId: invoiceId, 
        userId: user.userId,
        // I believe this should be either null or a string
        companyId: user.companyId,
        details: invoiceDetails
    }
    data.invoices.push(invoice)
    return invoice
}

/**
 * Stub for the getInvoice function.
 * 
 * return an invoice with the given invoice id and content type.
 * @param {string} token - the token of the current user
 * @param {string} invoiceId -  the id of the invoice we want to retrieve
 * @param {string} contentType - the type we want the invoice to be returned as (json or xml)
 * 
 * @returns {String | Invoice}
 */
export function retrieveInvoice(token: string, invoiceId: string, contentType: string): Invoice | String | void {
    const userInfo: User  = validators.validateToken(token);
	const invoiceInfo: Invoice = validators.validateUsersAccessToInvoice(userInfo, invoiceId);
    if (contentType.includes('application/xml'))  {
        // TODO: convert the response to an UBL2.0 document 
        // what do u mena convert it to a  ubl 2.0 how the fuck do i do that
    } 
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
    const userInfo: User  = validators.validateToken(token);
	const invoice: Invoice = validators.validateUsersAccessToInvoice(userInfo, invoiceId);
    const updatedInvoice = {...invoice, details: {...invoice.details, ...edits}}
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
export function deleteInvoice(token: string, invoiceId: string): boolean {
    const userInfo: User  = validators.validateToken(token);
	const invoice: Invoice = validators.validateUsersAccessToInvoice(userInfo, invoiceId);
    
    return null;
}


/** Stub for the listCompanyInvoices function 
 * 
 * List all invoices of a company,
 * then returns a JSON list.
 * 
 * @param {string} token - token of the user    
 * @param {string} companyName - name of the company
 * @returns {boolean}
 * 
*/
export function listCompanyInvoices(token: string, companyName: string): boolean {
    
    return null;
}
