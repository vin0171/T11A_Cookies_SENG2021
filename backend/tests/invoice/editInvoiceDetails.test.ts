import createServer from '../../server';
import { 
  Format,
  requestClear, 
  requestCompanyRegister, 
  requestCreateInvoice,
  requestEditInvoice,
  requestGetInvoice,
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

describe('editInvoiceDetails tests', () => {
  test('Successfully edit invoice details', async () => {
    const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword, "Firstname", "Lastname")).body;
    const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body;
    const invoiceDetails = { companyId, ...sampleInvoiceDetails };
    const createRes = await requestCreateInvoice(app, adminToken, invoiceDetails);
    const invoiceId = createRes.body;

    const edits = {
      notes: 'updated',
      total: 3000
    };

    const editRes = await requestEditInvoice(app, adminToken, invoiceId, edits);
    expect(editRes.status).toStrictEqual(200);
    const invoiceGet1 = await requestGetInvoice(app, adminToken, invoiceId, Format.JSON);
    expect(editRes.body).toEqual(expect.objectContaining(invoiceGet1.body));
  });


  test('Multiple edits to same invoice', async () => {
    const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword, "Firstname", "Lastname")).body;
    const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body;
    const invoiceDetails = { companyId, ...sampleInvoiceDetails };
    const createRes = await requestCreateInvoice(app, adminToken, invoiceDetails);
    const invoiceId = createRes.body;

    // First edit
    const edit1 = await requestEditInvoice(app, adminToken, invoiceId, {
      notes: 'updated',
      total: 3000
    });
    expect(edit1.status).toStrictEqual(200);
    const invoiceGet1 = await requestGetInvoice(app, adminToken, invoiceId, Format.JSON);
    expect(edit1.body).toEqual(expect.objectContaining(invoiceGet1.body));

    // Second edit
    const edit2 = await requestEditInvoice(app, adminToken, invoiceId, {
      notes: 'updated again',
      total: 2000
    });
    expect(edit2.status).toStrictEqual(200);
    const invoiceGet2 = await requestGetInvoice(app, adminToken, invoiceId, Format.JSON);
    expect(edit2.body).toEqual(expect.objectContaining(invoiceGet2.body));
  });

  test('Error when editing with invalid token', async () => {
    const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword, "Firstname", "Lastname")).body;
    const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body;
    const invoiceDetails = { companyId, ...sampleInvoiceDetails };
    const createRes = await requestCreateInvoice(app, adminToken, invoiceDetails);

    const editRes = await requestEditInvoice(app, 'invalidToken', createRes.body, {
      customerName: "Should Fail"
    });
    expect(editRes.status).toStrictEqual(401);
    expect(editRes.body).toEqual({ error: expect.any(String) });
  });

  test('Error when editing non-existent invoice', async () => {
    const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword, "Firstname", "Lastname")).body;
    
    const editRes = await requestEditInvoice(app, adminToken, 'nonexistentId', {
      customerName: "Should Fail"
    });
    expect(editRes.status).toStrictEqual(400);
    expect(editRes.body).toEqual({ error: expect.any(String) });
  });

});
