// import { getData, setData } from './dataStore';
// import * as helpers from './helper';
// import { Invoice, InvoiceState, User } from './interface';
// import { validateAdminPerms, validateToken } from './validationHelpers';

// /**
//  * Moves an invoice to the trash.
//  * 
//  * @param {string} token - The token of the current user.
//  * @param {string} invoiceId - The ID of the invoice to move to trash.
//  * @returns {null}
//  */
// export function moveInvoiceToTrash(token: string, invoiceId: string): null {
//     const user: User = validateToken(token);
//     let invoice: Invoice = validateAdminPerms(user, invoiceId);

//     if (invoice.details.state === InvoiceState.TRASHED) {
//         throw helpers.errorReturn(400, 'Error: Invoice is already in trash');
//     }

//     invoice.details.state = InvoiceState.TRASHED;
//     return null;
// }

// /**
//  * Retrieves all invoices that are currently in the trash.
//  * 
//  * @param {string} token - The token of the current user.
//  * @returns {Invoice[]} - List of trashed invoices.
//  */
// export function getTrashedInvoices(token: string): Invoice[] {
//     const user: User = validateToken(token);
//     const data = getData();

//     let trashedInvoices: Invoice[] = data.invoices.filter(
//         (invoice) => invoice.details.state === InvoiceState.TRASHED
//     );

//     return trashedInvoices;
// }

// /**
//  * Permanently deletes all invoices from the trash.
//  * 
//  * @param {string} token - The token of the current user.
//  * @returns {null}
//  */
// export function emptyTrash(token: string): null {
//     const user: User = validateToken(token);
//     const data = getData();

//     data.invoices = data.invoices.filter(
//         (invoice) => invoice.details.state !== InvoiceState.TRASHED
//     );

//     setData(data);
//     return null;
// }
