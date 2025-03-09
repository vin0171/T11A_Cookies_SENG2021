import createServer from '../../server';
import { requestClear, requestCompanyRegister, requestCreateInvoice, requestUserLogin, requestUserRegister, requestListCompanyInvoice } from '../testhelpers';
import { companyData, companyData2, sampleInvoiceDetails, sampleInvoiceDetails1, sampleInvoiceDetails2 } from '../sampleTestData';

const app = createServer();

beforeEach(async () => {
  await requestClear(app);
});

afterEach(async () => {
  await requestClear(app);
});

describe('listInvoices tests', () => {
  
    // Test Case: List multiple invoices successfully
    test('should return multiple invoices successfully', async () => {
      const companyId = (await requestCompanyRegister(app, companyData)).body.companyId;
      const adminToken = (await requestUserLogin(app, companyData.email, companyData.password)).body.token;
      
      const invoiceDetails1 = {companyId, ...sampleInvoiceDetails};
      const invoiceDetails2 = {companyId, ...sampleInvoiceDetails1};
      const invoiceDetails3 = {companyId, ...sampleInvoiceDetails2};
      
      const invoice1 = (await requestCreateInvoice(app, adminToken, invoiceDetails1)).body.invoiceId;
      const invoice2 = (await requestCreateInvoice(app, adminToken, invoiceDetails2)).body.invoiceId;
      const invoice3 = (await requestCreateInvoice(app, adminToken, invoiceDetails3)).body.invoiceId;
      
      const invoiceListRes = await requestListCompanyInvoice(app, adminToken, companyId);
      
      expect(invoiceListRes.status).toStrictEqual(200);
      expect(invoiceListRes.body.invoices).toEqual(expect.arrayContaining([invoice1, invoice2, invoice3]));
    });
  
    // Test Case: No invoices available
    test('should return an empty list if no invoices are available', async () => {
      const companyId = (await requestCompanyRegister(app, companyData)).body.companyId;
      const adminToken = (await requestUserLogin(app, companyData.email, companyData.password)).body.token;
      
      const invoiceListRes = await requestListCompanyInvoice(app, adminToken, companyId);
      
      expect(invoiceListRes.status).toStrictEqual(200);
      expect(invoiceListRes.body).toStrictEqual({invoices: []});
    });
  
    // Test Case: User not authorized to list invoices
    test('should return forbidden error if user is not authorized to list invoices', async () => {
      const companyId = (await requestCompanyRegister(app, companyData)).body.companyId;
      const unauthorizedToken = (await requestUserRegister(app, 'unauth@gmail.com', 'unauthpassword', 'lazy', 'bums')).body.token;
      const invoiceListRes = await requestListCompanyInvoice(app, unauthorizedToken, companyId);
      
      expect(invoiceListRes.status).toStrictEqual(403);
      expect(invoiceListRes.body).toStrictEqual({ error: expect.any(String) });
    });
  
    // Test Case: User from another company will see only their company's invoices
    test('User from another company will see only their companies invoices', async () => {
        const company1 = (await requestCompanyRegister(app, companyData)).body.companyId;
        const adminToken1 = (await requestUserLogin(app, companyData.email, companyData.password)).body.token;
    
        const company2 = (await requestCompanyRegister(app, companyData2)).body.companyId;
        const adminToken2 = (await requestUserLogin(app, companyData2.email, companyData2.password)).body.token;
        
        const invoiceDetails1 = { companyId: company1, ...sampleInvoiceDetails };
        const invoiceDetails2 = { companyId: company1, ...sampleInvoiceDetails1 };
        const invoice1 = (await requestCreateInvoice(app, adminToken1, invoiceDetails1)).body.invoiceId;
        const invoice2 = (await requestCreateInvoice(app, adminToken1, invoiceDetails2)).body.invoiceId;
        
        const invoiceListRes = await requestListCompanyInvoice(app, adminToken2, company2);
        
        expect(invoiceListRes.status).toStrictEqual(200);
        expect(invoiceListRes.body.invoices).toEqual(expect.arrayContaining([invoice1, invoice2]));

        const invoiceListRes2 = await requestListCompanyInvoice(app, adminToken1, company1);
        
        expect(invoiceListRes2.status).toStrictEqual(200);
        expect(invoiceListRes2.body).toEqual({invoices: []});
    });
  
  
});
