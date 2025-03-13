import * as validators from "./validationHelpers"
import { EmptyObject, Invoice, InvoiceDetails, InvoiceState, User } from "./interface";
import { getInvoice } from "./interfaceHelpers";
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
    user.invoices.push(invoice)/
    // You could definitely make this into a function but i dont WANT to
    if (user.companyId !== null) {
        const company = data.companies.find((c) => c.companyId === user.companyId);
        if (company === null) {
            throw helpers.errorReturn(400, 'Error: Company does not exist'); 
        } 
        company.invoices.push(invoice)
    }
    return invoice
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
export function retrieveInvoice(token: string, invoiceId: string, contentType: string): Invoice | String | void {
    const userInfo: User  = validators.validateToken(token);
	const invoiceInfo: Invoice = validators.validateUsersPerms(userInfo, invoiceId);
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

// export function deleteInvoice(token: string, invoiceId: string): null {
//     const user = validateToken(token);
//     let invoice = validateAdminPerms(user, invoiceId);

//     if (invoice.details.state === InvoiceState.TRASHED) {
//         // If already trashed, permanently delete it
//         const data = getData();
//         data.invoices = data.invoices.filter((inv) => inv.invoiceId !== invoiceId);
//         setData(data);
//         return null;
//     }

//     // Otherwise, move to trash first
//     invoice.details.state = InvoiceState.TRASHED;
//     return null;
// }

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
