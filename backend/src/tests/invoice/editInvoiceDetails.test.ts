import createServer from '../../server';
import { 
  requestClear, 
  requestCompanyRegister, 
  requestCreateInvoice,
  requestEditInvoice,
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
    const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword, "Firstname", "Lastname")).body.token;
    const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body.companyId;
    const invoiceDetails = { companyId, ...sampleInvoiceDetails };
    const createRes = await requestCreateInvoice(app, adminToken, invoiceDetails);
    const invoiceId = createRes.body.invoiceId;

    const edits = {
      customerName: "Updated Customer",
      totalAmount: 2000
    };

    const editRes = await requestEditInvoice(app, adminToken, invoiceId, edits);
    expect(editRes.status).toStrictEqual(200);
    expect(editRes.body).toEqual({});
  });


  test('Multiple edits to same invoice', async () => {
    const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword, "Firstname", "Lastname")).body.token;
    const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body.companyId;
    const invoiceDetails = { companyId, ...sampleInvoiceDetails };
    const createRes = await requestCreateInvoice(app, adminToken, invoiceDetails);
    const invoiceId = createRes.body.invoiceId;

    // First edit
    const edit1 = await requestEditInvoice(app, adminToken, invoiceId, {
      customerName: "First Edit"
    });
    expect(edit1.status).toStrictEqual(200);
    expect(edit1.body).toEqual({});

    // Second edit
    const edit2 = await requestEditInvoice(app, adminToken, invoiceId, {
      customerName: "Second Edit",
      totalAmount: 3000
    });
    expect(edit2.status).toStrictEqual(200);
    expect(edit2.body).toEqual({});
  });

  test('Error when editing with invalid token', async () => {
    const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword, "Firstname", "Lastname")).body.token;
    const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body.companyId;
    const invoiceDetails = { companyId, ...sampleInvoiceDetails };
    const createRes = await requestCreateInvoice(app, adminToken, invoiceDetails);

    const editRes = await requestEditInvoice(app, 'invalidToken', createRes.body.invoiceId, {
      customerName: "Should Fail"
    });
    expect(editRes.status).toStrictEqual(401);
    expect(editRes.body).toEqual({ error: expect.any(String) });
  });

  test('Error when editing non-existent invoice', async () => {
    const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword, "Firstname", "Lastname")).body.token;
    
    const editRes = await requestEditInvoice(app, adminToken, 'nonexistentId', {
      customerName: "Should Fail"
    });
    expect(editRes.status).toStrictEqual(400);
    expect(editRes.body).toEqual({ error: expect.any(String) });
  });

});
