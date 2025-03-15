import createServer from '../../server';
import { requestClear, requestCompanyRegister, requestCreateInvoice, requestUserLogin, requestGetInvoice, Format, requestCompanyAddUser, requestUserRegister } from '../testhelpers';
import { companyData, sampleInvoiceDetails, sampleInvoiceDetails1, sampleInvoiceDetails2 } from '../sampleTestData';
import { InvoiceState, InvoiceStatus } from '../../interface';
import * as path from 'path';
import { promises as fs } from 'fs'

const filePath = path.join(__dirname, 'sampleUBLFile.xml');

const app = createServer();

beforeEach(async () => {
  await requestClear(app);
});

afterEach(async () => {
  await requestClear(app);
});

const globalPassword = "adminOfCompanyPw@gmail.com122";

function expectAnyId(xml: string): string {
  return xml.replace(/<cbc:ID>.*?<\/cbc:ID>/g, '<cbc:ID>1111</cbc:ID>');
}

describe('getInvoice tests', () => {
  
    // Test Case: Get Invoice details in JSON Format Success
    test('should return invoice details in JSON format successfully', async () => {
      const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword , "Firstname", "Lastnane")).body.token;
      const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body.companyId;
      const invoiceDetails = { companyId, ...sampleInvoiceDetails };
      const invoiceRes = await requestCreateInvoice(app, adminToken, invoiceDetails);
      const invoiceId = invoiceRes.body.invoiceId;

      const invoiceResJson = await requestGetInvoice(app, adminToken, invoiceId, Format.JSON);
      expect(invoiceResJson.status).toStrictEqual(200);

      expect(invoiceResJson.body).toMatchObject({
        invoiceId: invoiceId,
        companyId: companyId,
        details: sampleInvoiceDetails
      });
    });
  
    // Test Case: Get Invoice details in UBL Format Success
    test('should return invoice details in UBL format successfully', async () => {
      const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword , "Firstname", "Lastnane")).body.token;
      const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body.companyId;
      const invoiceDetails = { companyId, ...sampleInvoiceDetails };
      const invoiceRes = await requestCreateInvoice(app, adminToken, invoiceDetails);
      const invoiceId = invoiceRes.body.invoiceId;
      
      const invoiceResUbl = await requestGetInvoice(app, adminToken, invoiceId, Format.UBL);
      expect(invoiceResUbl.status).toStrictEqual(200);
      //console.log(invoiceResUbl.text);
      const data = await fs.readFile(filePath, 'utf-8');
      expect(expectAnyId(invoiceResUbl.text)).toEqual(expectAnyId(data));
    });
  
    // Test Case: InvoiceId does not exist
    test('should return an error when the invoiceId does not exist', async () => {
      const invalidInvoiceId = "999999999";
      const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword , "Firstname", "Lastnane")).body.token;
      const invoiceRes = await requestGetInvoice(app, adminToken, invalidInvoiceId, Format.JSON);
      expect(invoiceRes.status).toStrictEqual(400);
      expect(invoiceRes.body).toStrictEqual({ error: expect.any(String) });
    });
  
    // Test Case: User is forbidden to view this invoice
    test('should return forbidden error when user is not authorized to view invoice', async () => {
      const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword , "Firstname", "Lastnane")).body.token;
      const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body.companyId;
      const invoiceDetails = { companyId, ...sampleInvoiceDetails };
      const invoiceRes = await requestCreateInvoice(app, adminToken, invoiceDetails);
      const invoiceId = invoiceRes.body.invoiceId;
      
      const unauthorizedToken = (await requestUserRegister(app,"nonexistentEmail@gmail.com", "globalPassword@123" , "Firstname", "Lastnane")).body.token;
      const invoiceResUnauthorized = await requestGetInvoice(app, unauthorizedToken, invoiceId, Format.JSON);
      expect(invoiceResUnauthorized.status).toStrictEqual(403);
      expect(invoiceResUnauthorized.body).toStrictEqual({ error: expect.any(String) });
    });
  
    // Test Case: Member of company is able to view this invoice
    test('should allow a member of the company to view the invoice', async () => {
      const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword , "Firstname", "Lastnane")).body.token;
      const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body.companyId;
      const invoiceDetails = { ...sampleInvoiceDetails };
      const invoiceRes = await requestCreateInvoice(app, adminToken, invoiceDetails);
      const invoiceId = invoiceRes.body.invoiceId;
      const userToken= (await requestUserRegister(app, 'enemyspotted@gmail.com', globalPassword , "Firstname", "Lastnane")).body.token;
      await requestCompanyAddUser(app, adminToken, companyId, 'enemyspotted@gmail.com');
      
      const invoiceResMember = await requestGetInvoice(app, userToken, invoiceId, Format.JSON);
      expect(invoiceResMember.status).toStrictEqual(200);
      expect(invoiceResMember.body).toMatchObject({
        invoiceId: invoiceId,
        companyId: companyId,
        details: sampleInvoiceDetails
      });
    })
  
    // Test Case: User does not exist
    test('should return an error when the user does not exist', async () => {
      const invalidToken = 'invalidToken';
      const invalidInvoiceId = "123456";
      
      const invoiceRes = await requestGetInvoice(app, invalidToken, invalidInvoiceId, Format.JSON);
      expect(invoiceRes.status).toStrictEqual(401);
      expect(invoiceRes.body).toStrictEqual({ error: expect.any(String)});
    });
  
    // Test Case: Multiple invoices Success
    test('should return multiple invoices successfully', async () => {
      const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword , "Firstname", "Lastnane")).body.token;
      const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body.companyId;
      
      const invoiceDetails1 = {  ...sampleInvoiceDetails };
      const invoiceDetails2 = { ...sampleInvoiceDetails1 };
      const invoiceDetails3 = { ...sampleInvoiceDetails2 };

      const invoiceId1 = (await requestCreateInvoice(app, adminToken, invoiceDetails1)).body.invoiceId;
      const invoiceId2 = (await requestCreateInvoice(app, adminToken, invoiceDetails2)).body.invoiceId;
      const invoiceId3 = (await requestCreateInvoice(app, adminToken, invoiceDetails3)).body.invoiceId;
	    const invoiceGet1 = await requestGetInvoice(app, adminToken, invoiceId1, Format.JSON);
	    const invoiceGet2 = await requestGetInvoice(app, adminToken, invoiceId2, Format.JSON);
	    const invoiceGet3 = await requestGetInvoice(app, adminToken, invoiceId3, Format.JSON);
	  
      expect(invoiceGet1.body).toMatchObject({
        invoiceId: invoiceId1,
        companyId: companyId,
        details: invoiceDetails1
      });

	  expect(invoiceGet2.body).toMatchObject({
      invoiceId: invoiceId2,
      companyId: companyId,
      details: invoiceDetails2
    });

	  expect(invoiceGet3.body).toMatchObject({
      invoiceId: invoiceId3,
      companyId: companyId,
      details: invoiceDetails3
    });
    });

});
