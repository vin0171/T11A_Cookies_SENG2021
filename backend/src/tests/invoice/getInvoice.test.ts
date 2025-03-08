import createServer from '../../server';
import { requestClear, requestCompanyRegister, requestCreateInvoice, requestUserLogin, requestUserRegister, requestGetInvoice, Format, requestCompanyAddUser } from '../testhelpers';
import { companyData, sampleInvoiceDetails, sampleInvoiceDetails1, sampleInvoiceDetails2 } from '../sampleTestData';
import { InvoiceState, InvoiceStatus } from '../../interface';

const app = createServer();

beforeEach(async () => {
  await requestClear(app);
});

afterEach(async () => {
  await requestClear(app);
});

describe('getInvoice tests', () => {
  
    // Test Case: Get Invoice details in JSON Format Success
    test('should return invoice details in JSON format successfully', async () => {
      const companyId = (await requestCompanyRegister(app, companyData)).body.companyId;
      const adminToken = (await requestUserLogin(app, companyData.email, companyData.password)).body.token;
      const invoiceDetails = { companyId, ...sampleInvoiceDetails };
      const invoiceRes = await requestCreateInvoice(app, adminToken, invoiceDetails);
      const invoiceId = invoiceRes.body.invoiceId;

      const invoiceResJson = await requestGetInvoice(app, adminToken, invoiceId, Format.JSON);
      expect(invoiceResJson.status).toStrictEqual(200);

      expect(invoiceResJson.body).toMatchObject({
        invoiceId: invoiceId,
        status: InvoiceStatus.DRAFT,
        state: InvoiceState.MAIN,
        total: 2902.95, 
        ...sampleInvoiceDetails
      });
    });
  
    // Test Case: Get Invoice details in UBL Format Success
    test('should return invoice details in UBL format successfully', async () => {
      const companyId = (await requestCompanyRegister(app, companyData)).body.companyId;
      const adminToken = (await requestUserLogin(app, companyData.email, companyData.password)).body.token;
      const invoiceDetails = { companyId, ...sampleInvoiceDetails };
      const invoiceRes = await requestCreateInvoice(app, adminToken, invoiceDetails);
      const invoiceId = invoiceRes.body.invoiceId;
      
      const invoiceResUbl = await requestGetInvoice(app, adminToken, invoiceId, Format.UBL);
      expect(invoiceResUbl.status).toStrictEqual(200);
      expect(invoiceResUbl.text).toContain('<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">');
      // Add more validation as per your UBL format
    });
  
    // Test Case: InvoiceId does not exist
    test('should return an error when the invoiceId does not exist', async () => {
      const invalidInvoiceId = 999999999;
      const adminToken = (await requestUserLogin(app, companyData.email, companyData.password)).body.token;
      const invoiceRes = await requestGetInvoice(app, adminToken, invalidInvoiceId, Format.JSON);
      expect(invoiceRes.status).toStrictEqual(401);
      expect(invoiceRes.body).toStrictEqual({ error: expect.any(String) });
    });
  
    // Test Case: User is forbidden to view this invoice
    test('should return forbidden error when user is not authorized to view invoice', async () => {
      const companyId = (await requestCompanyRegister(app, companyData)).body.companyId;
      const adminToken = (await requestUserLogin(app, companyData.email, companyData.password)).body.token;
      const invoiceDetails = { companyId, ...sampleInvoiceDetails };
      const invoiceRes = await requestCreateInvoice(app, adminToken, invoiceDetails);
      const invoiceId = invoiceRes.body.invoiceId;
      
      const unauthorizedToken = (await requestUserLogin(app, 'nonexistentemail@gmail.com', 'wrongpassword')).body.token;
      const invoiceResUnauthorized = await requestGetInvoice(app, unauthorizedToken, invoiceId, Format.JSON);
      expect(invoiceResUnauthorized.status).toStrictEqual(403);
      expect(invoiceResUnauthorized.body).toStrictEqual({ error: expect.any(String) });
    });
  
    // Test Case: Member of company is able to view this invoice
    test('should allow a member of the company to view the invoice', async () => {
      const companyId = (await requestCompanyRegister(app, companyData)).body.companyId;
      const adminToken = (await requestUserLogin(app, companyData.email, companyData.password)).body.token;
      const invoiceDetails = { companyId, ...sampleInvoiceDetails };
      const invoiceRes = await requestCreateInvoice(app, adminToken, invoiceDetails);
      const invoiceId = invoiceRes.body.invoiceId;

      const userToken = (await requestUserLogin(app, 'enemyspotted@gmail.com', companyData.password)).body.token;
      await requestCompanyAddUser(app, adminToken, companyId, 'enemyspotted@gmail.com');
      
      const invoiceResMember = await requestGetInvoice(app, userToken, invoiceId, Format.JSON);
      expect(invoiceResMember.status).toStrictEqual(200);
      expect(invoiceResMember.body).toMatchObject({
        invoiceId: invoiceId,
        status: InvoiceStatus.DRAFT,
        state: InvoiceState.MAIN,
        total: 2902.95, 
        ...sampleInvoiceDetails
      });
    })
  
    // Test Case: User does not exist
    test('should return an error when the user does not exist', async () => {
      const invalidToken = 'invalidToken';
      const invalidInvoiceId = 123456;
      
      const invoiceRes = await requestGetInvoice(app, invalidToken, invalidInvoiceId, Format.JSON);
      expect(invoiceRes.status).toStrictEqual(401);
      expect(invoiceRes.body).toStrictEqual({ error: expect.any(String)});
    });
  
    // Test Case: Multiple invoices Success
    test('should return multiple invoices successfully', async () => {
      const companyId = (await requestCompanyRegister(app, companyData)).body.companyId;
      const adminToken = (await requestUserLogin(app, companyData.email, companyData.password)).body.token;
      
      const invoiceDetails1 = { companyId, ...sampleInvoiceDetails };
      const invoiceDetails2 = { companyId, ...sampleInvoiceDetails1 };
      const invoiceDetails3 = { companyId, ...sampleInvoiceDetails2 };

      const invoiceId1 = (await requestCreateInvoice(app, adminToken, invoiceDetails1)).body.invoiceId;
      const invoiceId2 = (await requestCreateInvoice(app, adminToken, invoiceDetails2)).body.invoiceId;
      const invoiceId3 = (await requestCreateInvoice(app, adminToken, invoiceDetails3)).body.invoiceId;
	  const invoiceGet1 = await requestGetInvoice(app, adminToken, invoiceId1, Format.JSON);
	  const invoiceGet2 = await requestGetInvoice(app, adminToken, invoiceId2, Format.JSON);
	  const invoiceGet3 = await requestGetInvoice(app, adminToken, invoiceId3, Format.JSON);
	  
      expect(invoiceGet1.body).toMatchObject({
        invoiceId: invoiceId1,
        status: InvoiceStatus.DRAFT,
        state: InvoiceState.MAIN,
        total: 2902.95, 
        ...sampleInvoiceDetails
      });

	  expect(invoiceGet2.body).toMatchObject({
        invoiceId: invoiceId2,
        status: InvoiceStatus.DRAFT,
        state: InvoiceState.MAIN,
        total: 13081.73, 
        ...sampleInvoiceDetails1
      });

	  expect(invoiceGet3.body).toMatchObject({
        invoiceId: invoiceId3,
        status: InvoiceStatus.DRAFT,
        state: InvoiceState.MAIN,
        total: 17008.75, 
        ...sampleInvoiceDetails2
      });
    });

});
