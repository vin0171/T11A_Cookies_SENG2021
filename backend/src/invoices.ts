

/**
 * Stub for the createInvoice function.
 * 
 * Create an invoice with a sender, receiver, issue date, and due date,
 * then returns a boolean.
 * 
 * @param {object} invoiceDetails - contains all invoice details
 * @returns {boolean}
 */
export function createInvoice(invoiceDetails: object): boolean {

    return null;
}


/**
 * Stub for the getInvoice function.
 * 
 * Get an invoice with a sender, receiver, issue date, and due date,
 * then returns a boolean.
 * 
 * @param {string} sender - sender of the invoice
 * @param  {string} receiver - receiver of the invoice
 * @param  {string} issueDate - issue date of the invoice
 * @param  {string} dueDate - due date of the invoice
 * @returns {boolean}
 */
export function getInvoice(sender: string, receiver: string, issueDate: string, dueDate: string): boolean {

    return null;
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
 * @returns {boolean}
 */  
export function editInvoiceStatus(token: string, status: string): boolean {

    return null;
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
