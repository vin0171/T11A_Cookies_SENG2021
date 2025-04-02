import createServer from '../../server';
import { requestClear, requestCompanyRegister, requestCreateInvoice, requestUserRegister, requestListCompanyInvoice, Format, requestGetInvoice } from '../testhelpers';
import { companyData, companyData2, sampleInvoiceDetails, sampleInvoiceDetails1, sampleInvoiceDetails2 } from '../sampleTestData';

const app = createServer();

beforeEach(async () => {
  await requestClear(app);
});

afterEach(async () => {
  await requestClear(app);
});

const globalPassword = "veryVlaidPassword@q2133"
describe('listInvoices tests', () => {
  
    // Test Case: List multiple invoices successfully
    test('should return multiple invoices successfully', async () => {
      const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword , "Firstname", "Lastnane")).body;
      const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body;

      const invoiceDetails1 = {companyId, ...sampleInvoiceDetails};
      const invoiceDetails2 = {companyId, ...sampleInvoiceDetails1};
      const invoiceDetails3 = {companyId, ...sampleInvoiceDetails2};
      
      const invoiceId1 = (await requestCreateInvoice(app, adminToken, invoiceDetails1)).body;
      const invoiceId2 = (await requestCreateInvoice(app, adminToken, invoiceDetails2)).body;
      const invoiceId3 = (await requestCreateInvoice(app, adminToken, invoiceDetails3)).body;
      const invoiceGet1 = await requestGetInvoice(app, adminToken, invoiceId1, Format.JSON);
      const invoiceGet2 = await requestGetInvoice(app, adminToken, invoiceId2, Format.JSON);
      const invoiceGet3 = await requestGetInvoice(app, adminToken, invoiceId3, Format.JSON);
        
      
      const invoiceListRes = await requestListCompanyInvoice(app, adminToken, companyId);
      expect(invoiceListRes.body).toEqual(expect.arrayContaining([
        expect.objectContaining(invoiceGet1.body),
        expect.objectContaining(invoiceGet2.body),
        expect.objectContaining(invoiceGet3.body),
      ]));
      expect(invoiceListRes.status).toStrictEqual(200);
      
    });
  
    // Test Case: No invoices available
    test('should return an empty list if no invoices are available', async () => {
      const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword , "Firstname", "Lastnane")).body;
      const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body;
      
      const invoiceListRes = await requestListCompanyInvoice(app, adminToken, companyId);
      
      expect(invoiceListRes.status).toStrictEqual(200);
      expect(invoiceListRes.body).toStrictEqual([]);
    });

    // Test Case: Company does not exist
    test('should return error if company does not exist', async () => {
      const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword , "Firstname", "Lastnane")).body;
      (await requestCompanyRegister(app, adminToken, companyData));
      
      const invoiceListRes = await requestListCompanyInvoice(app, adminToken, 'non-existent-company-id');
      
      expect(invoiceListRes.status).toStrictEqual(400);
      expect(invoiceListRes.body).toStrictEqual({ error: expect.any(String) });
    });
    
      
  
    // Test Case: User not authorized to list invoices
    test('should return forbidden error if user is not authorized to list invoices', async () => {

      const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword , "Firstname", "Lastnane")).body;
      const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body;

      const unauthorizedToken = (await requestUserRegister(app, 'unauth@gmail.com', 'unauthpassword@!123', 'Lastname', 'bums')).body;
      const invoiceListRes = await requestListCompanyInvoice(app, unauthorizedToken, companyId);
      
      expect(invoiceListRes.status).toStrictEqual(403);
      expect(invoiceListRes.body).toStrictEqual({ error: expect.any(String) });
    });
  
    // Test Case: User from another company will see only their company's invoices
    test('User from another company will see only their companies invoices', async () => {
      const adminToken1 = (await requestUserRegister(app, companyData.companyEmail, globalPassword , "Firstname", "Lastnane")).body;
      const companyId = (await requestCompanyRegister(app, adminToken1, companyData)).body;

      const adminToken2 = (await requestUserRegister(app, companyData2.companyEmail, globalPassword , "Firstname", "Lastasanane")).body;
      const company2 = (await requestCompanyRegister(app, adminToken2, companyData2)).body;
        
        const invoiceDetails1 = { ...sampleInvoiceDetails };
        const invoiceDetails2 = { ...sampleInvoiceDetails1 };
        const id1 = (await requestCreateInvoice(app, adminToken1, invoiceDetails1)).body;
        const id2 = (await requestCreateInvoice(app, adminToken1, invoiceDetails2)).body;
        const invoiceGet1 = await requestGetInvoice(app, adminToken1, id1, Format.JSON);
        const invoiceGet2 = await requestGetInvoice(app, adminToken1, id2, Format.JSON);
        
        const invoiceListRes = await requestListCompanyInvoice(app, adminToken2, company2);
        
        expect(invoiceListRes.status).toStrictEqual(200);
        expect(invoiceListRes.body.invoices).toEqual(expect.arrayContaining([]));

        const invoiceListRes2 = await requestListCompanyInvoice(app, adminToken1, companyId);
        
        expect(invoiceListRes2.status).toStrictEqual(200);
        expect(invoiceListRes2.body).toEqual(expect.arrayContaining([
          expect.objectContaining(invoiceGet1.body),
          expect.objectContaining(invoiceGet2.body),
        ]));
    });
  
  
});
