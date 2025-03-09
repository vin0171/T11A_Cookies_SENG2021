import { getData } from "./dataStore";
import * as helpers from "./helper";
import * as validators from "./validationHelpers"
import { Company, EmptyObject, Invoice, InvoiceGroups, InvoiceState, InvoiceStatus, Session, User } from "./interface";
import { get } from "http";
import { getCompany, getInvoice, getUser } from "./interfaceHelpers";


/**
 * Stub for the createInvoice function.
 * 
 * Create an invoice with a sender, receiver, issue date, and due date,
 * then returns a boolean.
 * 
 * @param {object} invoiceDetails - contains all invoice details
 * @returns {object}
 */
export function createInvoice(token: string, invoiceDetails: object): object {



    return {invoiceId: 1};
}


/**
 * Stub for the getInvoice function.
 * 
 * Get an invoice with a sender, receiver, issue date, and due date,
 * then returns a boolean.
 * @returns {Invoice} - A JSON-Object representing the Invoice
 * @returns {String} - A string representing the UBL 
 */
export function retrieveInvoice(token: string, invoiceId: number, ): Invoice {
    const userInfo: User  = validators.validateSessionToken(token);
	const invoiceInfo: Invoice = validators.validateUsersAccessToInvoice(userInfo, invoiceId);
    return invoiceInfo;
}


/**
 * Stub for the editInvoiceDetails function.
 * 
 * Edit the details of an invoice with a sender, receiver, issue date, and due date,
 * then returns a boolean.
 * 
 * @param {string} sender - sender of the invoice
 * @param  {string} receiver - receiver of the invoice
 * @param  {string} issueDate - issue date of the invoice
 * @param  {string} dueDate - due date of the invoice
 * @returns {boolean}
 */
export function editInvoiceDetails(sender: string, receiver: string, issueDate: string, dueDate: string): boolean {

    return null;
}


/**
 * Stub for the editInvoiceStatus function.
 * 
 * Edit the status of an invoice with a token and status,
 * then returns a boolean.
 * 
 * @param {string} token - token of the user
 * @param  {string} status - status of the invoice
 * @returns {}
 */  
export function editInvoiceState(token: string, invoiceId: number, status: string): EmptyObject {
    const userInfo: User  = validators.validateSessionToken(token);
	const invoiceInfo: Invoice = validators.validateUsersAccessToInvoice(userInfo, invoiceId);
    
    // Convert the status string to an InvoiceState enum
    const enumStatus: InvoiceState | undefined = Object.values(InvoiceState).find(key => key === status);
    if (enumStatus === undefined) throw helpers.errorReturn(400, 'open your eyes pelase');
    // Change the state to the same state doesnt really do anything
    if (enumStatus === invoiceInfo.state) return {}; 

    // Move invoice inside a Company InvoiceGroup to another Company InvoiceGroup
    const currentState: InvoiceState = invoiceInfo.state;
    const dataStore = getData();
    const companyInvoices: InvoiceGroups = getCompany(invoiceInfo.companyOwnerId).invoices;

    companyInvoices[currentState].filter(invoiceNo => invoiceNo === invoiceId);






    // Set the state of the invoice to the new status
    invoiceInfo.state = enumStatus;
   


    return {}
}


/** Stub for the deleteInvoice function
 * 
 * Delete an invoice with a token and invoiceId,
 * then returns a boolean.
 * 
 * @param {string} token - token of the user    
 * @param {number} invoiceId - id of the invoice
 * @returns {boolean}
 */
export function deleteInvoice(token: string, invoiceId: number): boolean {
    
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
