import * as validators from "./validationHelpers"
import { Invoice, InvoiceDetails, InvoiceDetailsV2, InvoiceV2 } from "./interface";
import { generateInvoice, generateInvoiceV2, getCompany,  } from "./interfaceHelpers";
import { getData } from "./dataStore";
import {v4 as uuidv4} from 'uuid';
import HTTPError from 'http-errors';

/**
 * Stub for the createInvoice function.
 * 
 * Create an invoice with a given details and return it.
 * 
 * @param {string} token - the token of the current user
 * @param {InvoiceDetails} invoiceDetails - contains all invoice details
 * @returns {string}
 */
export async function createInvoice(token: string, invoiceDetails: InvoiceDetails) : Promise<string> {
    const user = await validators.validateToken(token);
    const data = getData();
    const invoiceId = uuidv4();
    const invoiceInfo : Invoice = generateInvoice(invoiceId, user.userId, user.companyId, invoiceDetails);

    await data.put({ TableName: "Invoices", Item: invoiceInfo });
    await addInvoiceIdToTable("Users", user.userId, invoiceId);

    if (user.companyId !== null) {
        await addInvoiceIdToTable("Companies", user.companyId, invoiceId)
    }
    return invoiceInfo.invoiceId;
}

/**
 * Stub for the createInvoicev2 function.
 * 
 * Create an invoice with a given details and return it (Version 2).
 * 
 * @param {string} token - the token of the current user
 * @param {string} invoiceId - the id for the invoice
 * @param {InvoiceDetails} invoiceDetails - contains all invoice details
 * @param {boolean} isDraft - states whether the invoice is a draft or not
 * @returns {string}
 */
export async function createInvoiceV2(token: string, invoiceId: string, invoiceDetails: InvoiceDetailsV2, isDraft: boolean) : Promise<string> {
    const user = await validators.validateToken(token);
    const data = getData();
    const invoiceInfo : InvoiceV2 = generateInvoiceV2(invoiceId, user.userId, user.companyId, invoiceDetails, isDraft);
    
    await data.put({ TableName: "Invoices", Item: invoiceInfo });
    await addInvoiceIdToTable("Users", user.userId, invoiceId);

    if (user.companyId !== null) {
        await addInvoiceIdToTable("Companies", user.companyId, invoiceId)
    }
    return invoiceInfo.invoiceId;
}


// TODO: fix the two functions below if you want (Hashmap of name to object? idk)
// and also i dont use this in other functions so um 
function keyIdentifer(tableName: string, primaryKeyIdentifer: string) {
    if (tableName === "Companies") return { companyId: primaryKeyIdentifer }
    if (tableName === "Invoices") return { invoiceId: primaryKeyIdentifer }
    return { userId: primaryKeyIdentifer }
}

async function addInvoiceIdToTable(tableName: string, primaryKeyIdentifer: string, invoiceId: string) {
    const data = getData();
    await data.update({
        TableName: tableName,
        Key: keyIdentifer(tableName, primaryKeyIdentifer),
        UpdateExpression: 'SET invoices = list_append(invoices, :invoiceId)',
        ExpressionAttributeValues: { ':invoiceId': [invoiceId] }
    });

}

/**
 * Stub for the getInvoice function.
 * 
 * Return an invoice with the given invoice id and content type.
 * @param {string} token - the token of the current user
 * @param {string} invoiceId -  the id of the invoice we want to retrieve
 */
export async function retrieveInvoice(token: string, invoiceId: string) {
    const user = await validators.validateToken(token);
	const invoiceInfo = await validators.validateUsersPerms(user.userId, user.companyId, invoiceId);
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
 */
export async function editInvoiceDetails(token: string, invoiceId: string, edits: Partial<InvoiceDetails>) {
    const user = await validators.validateToken(token);
	const invoice = await validators.validateAdminPerms(user.userId, user.companyId, invoiceId);
    Object.assign(invoice.details, edits);
    const data = getData();
    await data.update({
        TableName: "Invoices",
        Key: keyIdentifer("Invoices", invoiceId),
        UpdateExpression: 'SET details = :invoiceDetailsNew',
        ExpressionAttributeValues: { ':invoiceDetailsNew': invoice.details }
    });
    return invoice;
}

// TODO: This function is very simialr to the insert just so yk
// DO NOT USE THIS FUNCTION WITH TABLENAME: INVOICES
async function removeInvoiceIdFromTable(tableName: string, primaryKeyIdentifer: string, invoiceIdToRemove: string, invoiceList: string[]) {
    const newInvoiceList = invoiceList.filter((invId: string) => invId !== invoiceIdToRemove);
    const data = getData();
    await data.update({
        TableName: tableName,
        Key: keyIdentifer(tableName, primaryKeyIdentifer),
        UpdateExpression: 'SET invoices = :newInvoiceList',
        ExpressionAttributeValues: { ':newInvoiceList': newInvoiceList}
    });
}

/** Stub for the deleteInvoice function
 * 
 * Delete an invoice with the given invoice id
 * 
 * @param {string} token - token of the user     
 * @param {number} invoiceId - id of the invoice
 */
export async function deleteInvoice(token: string, invoiceId: string) {
    const data = getData();
    const user = await validators.validateToken(token);
	const invoice = await validators.validateAdminPerms(user.userId, user.companyId, invoiceId);
    const company = await getCompany(user.companyId);
    const invoiceIdToRemove = invoice.invoiceId;

    await data.delete({ TableName: "Invoices", Key: { invoiceId: invoiceIdToRemove } });
    await removeInvoiceIdFromTable("Users", user.userId, invoiceIdToRemove, user.invoices);

    if (user.companyId !== null) {
        await removeInvoiceIdFromTable("Companies", user.companyId, invoiceIdToRemove, company.invoices);
    }
    return {};
}

async function getInvoiceList(invoiceList: number[]) {
    const invoiceMap = invoiceList.map((inv: number) => ({ invoiceId: inv }));
    if (invoiceList.length === 0) return invoiceList;
    const data = getData();
    const response = await data.batchGet({
        RequestItems: { Invoices: { Keys: invoiceMap } }
    });
    return response.Responses.Invoices;
}


/** Stub for the listCompanyInvoices function 
 * 
 * Returns a list of every invoice in a given company.
 * 
 * @param {string} token - token of the user    
 * @param {string} companyId - the id of the company
 * 
*/
export async function listCompanyInvoices(token: string, companyId: string) {
    const data = getData();
    const user = await validators.validateToken(token);
    const company = await getCompany(companyId); 
    if (user.companyId != company.companyId) {
        throw HTTPError(403, 'Error: User is not authorised')
    }
    return getInvoiceList(company.invoices);
}

// /** Stub for the listUsersInvoices function 
//  * 
//  * Returns a list of every invoice for a given user.
//  * 
//  * @param {string} token - token of the user 
//  * @returns {Invoice[]}
//  * 
// */
export async function listUserInvoices(token: string) {
    const user = await validators.validateToken(token);
    return getInvoiceList(user.invoices);
}

