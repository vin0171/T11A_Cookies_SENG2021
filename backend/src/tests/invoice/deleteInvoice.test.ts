import createServer from '../../server';
import { 
  requestClear, 
  requestCompanyRegister, 
  requestCreateInvoice, 
  requestDeleteInvoice,
  requestUserRegister 
} from '../testhelpers';
import { companyData, sampleInvoiceDetails } from '../sampleTestData';

const app = createServer();

beforeEach(async () => {
  await requestClear(app);
});

afterEach(async () => {
  await requestClear(app);
});

const globalPassword = "adminOfCompanyPw@gmail.com122";

describe('deleteInvoice tests', () => {
  test('Successfully deletes an invoice', async () => {
    const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword, "Firstname", "Lastname")).body.token;
    const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body.companyId;
    const invoiceDetails = { companyId, ...sampleInvoiceDetails };
    const createRes = await requestCreateInvoice(app, adminToken, invoiceDetails);
    const invoiceId = createRes.body.invoiceId;

    const deleteRes = await requestDeleteInvoice(app, adminToken, invoiceId);
    expect(deleteRes.status).toStrictEqual(200);
    expect(deleteRes.body).toStrictEqual({});
  });

  test('Any user can delete invoice regardless of company membership', async () => {
    // Create first user and invoice
    const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword, "Firstname", "Lastname")).body.token;
    const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body.companyId;
    const invoiceDetails = { companyId, ...sampleInvoiceDetails };
    const createRes = await requestCreateInvoice(app, adminToken, invoiceDetails);
    
    // Create second user
    const userToken = (await requestUserRegister(app, "testingEmail@gmail.com", globalPassword, "Firstname", "Lastname")).body.token;
    
    // Second user attempts to delete first user's invoice
    const deleteRes = await requestDeleteInvoice(app, userToken, createRes.body.invoiceId);
    expect(deleteRes.status).toStrictEqual(403);
    expect(deleteRes.body).toStrictEqual({ error: expect.any(String) });
  });

  test('Deleting multiple invoices from one company', async () => {
    const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword, "Firstname", "Lastname")).body.token;
    const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body.companyId;
    const invoiceDetails = { ...sampleInvoiceDetails };

    // Create and delete multiple invoices
    const invoice1 = await requestCreateInvoice(app, adminToken, invoiceDetails);
    const invoice2 = await requestCreateInvoice(app, adminToken, invoiceDetails);
    const invoice3 = await requestCreateInvoice(app, adminToken, invoiceDetails);

    const delete1 = await requestDeleteInvoice(app, adminToken, invoice1.body.invoiceId);
    const delete2 = await requestDeleteInvoice(app, adminToken, invoice2.body.invoiceId);
    const delete3 = await requestDeleteInvoice(app, adminToken, invoice3.body.invoiceId);

    expect(delete1.status).toStrictEqual(200);
    expect(delete2.status).toStrictEqual(200);
    expect(delete3.status).toStrictEqual(200);
  });

  test('Error when deleting with invalid token', async () => {
    const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword, "Firstname", "Lastname")).body.token;
    const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body.companyId;
    const invoiceDetails = { companyId, ...sampleInvoiceDetails };
    const createRes = await requestCreateInvoice(app, adminToken, invoiceDetails);

    const deleteRes = await requestDeleteInvoice(app, 'invalidToken', createRes.body.invoiceId);
    expect(deleteRes.status).toStrictEqual(401);
    expect(deleteRes.body).toStrictEqual({ error: expect.any(String) });
  });

  test('Error when deleting non-existent invoice', async () => {
    const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword, "Firstname", "Lastname")).body.token;
    
    const deleteRes = await requestDeleteInvoice(app, adminToken, 'nonexistentId');
    expect(deleteRes.status).toStrictEqual(400);
    expect(deleteRes.body).toStrictEqual({ error: expect.any(String) });
  });

  test('Error when deleting already deleted invoice', async () => {
    const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword, "Firstname", "Lastname")).body.token;
    const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body.companyId;
    const invoiceDetails = { companyId, ...sampleInvoiceDetails };
    
    const createRes = await requestCreateInvoice(app, adminToken, invoiceDetails);
    const invoiceId = createRes.body.invoiceId;

    // Delete invoice first time
    await requestDeleteInvoice(app, adminToken, invoiceId);
    
    // Try to delete same invoice again
    const deleteRes = await requestDeleteInvoice(app, adminToken, invoiceId);
    expect(deleteRes.status).toStrictEqual(400);
    expect(deleteRes.body).toStrictEqual({ error: expect.any(String) });
  });
}); 