import createServer from '../../server';
import { requestClear, requestCompanyRegister, requestCreateInvoice, requestUserLogin, requestUserRegister } from '../testhelpers';
import { companyData, sampleInvoiceDetails, sampleInvoiceDetails1, sampleInvoiceDetails2 } from '../sampleTestData';

const app = createServer();

beforeEach(async () => {
  await requestClear(app);
});

afterEach(async () => {
  await requestClear(app);
});

const globalPassword = "adminOfCompanyPw@gmail.com122";

describe('createInvoice tests', () => {
    test('Creates an invoice for company from JSON document', async () => {
        const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword , "Firstname", "Lastnane")).body.token;
        const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body.companyId;
        // Add the companyId that owns the invoice
        const invoiceDetails = {companyId, ...sampleInvoiceDetails}
        const invoiceRes = (await requestCreateInvoice(app, adminToken, invoiceDetails));

        const expectedResponse = { invoiceId: expect.any(String) };
        expect(invoiceRes.body).toStrictEqual(expectedResponse);
        expect(invoiceRes.status).toStrictEqual(200);
    });

    test('Invoice can be created reguardless of whether they in company or not', async () => {
        const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword , "Firstname", "Lastnane")).body.token;
        const userToken = (await requestUserRegister(app, "testingEmail@gmail.com", globalPassword , "Firstname", "Lastnane")).body.token;
        const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body.companyId;
        // Add the companyId that owns the invoice
        const invoiceDetails = {companyId, ...sampleInvoiceDetails}
        const invoiceRes = (await requestCreateInvoice(app, userToken, invoiceDetails));
        expect(invoiceRes.body).toStrictEqual({ invoiceId: expect.any(String) });
        expect(invoiceRes.status).toStrictEqual(200);
    });

    test('Creating multiple invoices for one company', async () => {
        const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword , "Firstname", "Lastnane")).body.token;
        const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body.companyId;
        // Add the companyId that owns the invoice
        const invoiceDetails = {companyId, ...sampleInvoiceDetails};
        const invoiceDetails1 = {companyId, ...sampleInvoiceDetails1};
        let invoiceRes = (await requestCreateInvoice(app, adminToken, invoiceDetails));
        expect(invoiceRes.status).toStrictEqual(200);
        invoiceRes = (await requestCreateInvoice(app, adminToken, invoiceDetails1));
        expect(invoiceRes.status).toStrictEqual(200);
        invoiceRes = (await requestCreateInvoice(app, adminToken, invoiceDetails));
        expect(invoiceRes.status).toStrictEqual(200);
    });

    test('Multiple companies and multiple invoices', async () => {
        const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword , "Firstname", "Lastnane")).body.token;
        const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body.companyId;
        // Add the companyId that owns the invoice
        const invoiceDetails = {...sampleInvoiceDetails};
        const invoiceDetails1 = {...sampleInvoiceDetails1};
        let invoiceRes = (await requestCreateInvoice(app, adminToken, invoiceDetails));
        expect(invoiceRes.status).toStrictEqual(200);
        invoiceRes = (await requestCreateInvoice(app, adminToken, invoiceDetails1));
        expect(invoiceRes.status).toStrictEqual(200);

        const companyClone = { ...companyData };
        companyClone.companyEmail = 'adminOfCompanyEmail2@gmail.com'
        companyClone.companyName = 'Turple Industried. Inc'
        const adminToken1 = (await requestUserRegister(app, companyClone.companyEmail, globalPassword , "Firstname", "Lastnane")).body.token;
        const companyId1 = (await requestCompanyRegister(app, adminToken1, companyClone)).body.companyId;

        const invoiceDetails2 = {...sampleInvoiceDetails}
        const invoiceDetails3 = {...sampleInvoiceDetails1}
        const invoiceRes1 = (await requestCreateInvoice(app, adminToken1, invoiceDetails2));
        expect(invoiceRes1.status).toStrictEqual(200);  

        const invoiceRes2 = (await requestCreateInvoice(app, adminToken1, invoiceDetails3));
        expect(invoiceRes2.status).toStrictEqual(200);  
    });

    test('Check for unique invoice IDs returned', async () => {
        const invoiceArray = [];
        const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword , "Firstname", "Lastnane")).body.token;
        const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body.companyId;
        // Add the companyId that owns the invoice
        const invoiceDetails = {...sampleInvoiceDetails}
        const invoiceDetails1 = {...sampleInvoiceDetails1}
        const invoiceDetails2 = {...sampleInvoiceDetails2}
        invoiceArray.push((await requestCreateInvoice(app, adminToken, invoiceDetails)).body.invoiceId);
        invoiceArray.push((await requestCreateInvoice(app, adminToken, invoiceDetails1)).body.invoiceId);
        invoiceArray.push((await requestCreateInvoice(app, adminToken, invoiceDetails2)).body.invoiceId);

        const uniqueTokens = Array.from(new Set(invoiceArray));
        expect(uniqueTokens).toHaveLength(3);
    });

    test.each([
        ['quantity', -9],
        ['unitPrice', -324.38],
        ['discountAmount', -43.9],
        ['taxAmount', -42.07],
        ['taxRate', -15],
        ['totalAmount', -2902.95]
      ])('Negative amount for %s should return an error', async (field, invalidValue) => {
        const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword , "Firstname", "Lastnane")).body.token;
        const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body.companyId;
          const invalidInvoiceDetails = {
              sender: sampleInvoiceDetails.sender,
              receiver: sampleInvoiceDetails.receiver,
              issueDate: sampleInvoiceDetails.issueDate,
              dueDate: sampleInvoiceDetails.dueDate,
              repeating: sampleInvoiceDetails.repeating,
              currency: sampleInvoiceDetails.currency,
              notes: sampleInvoiceDetails.notes,
              items: [{
                  itemSku: "SKU79842",
                  itemName: "Product Beta",
                  description: "Description for Product Beta",
                  quantity: (field === 'quantity' ? invalidValue : 9),
                  unitPrice: field === 'unitPrice' ? invalidValue : 324.38,
                  discountAmount: field === 'discountAmount' ? invalidValue : 43.9,
                  taxAmount: field === 'taxAmount' ? invalidValue : 42.07,
                  taxRate: field === 'taxRate' ? invalidValue : 15,
                  totalAmount: field === 'totalAmount' ? invalidValue : 2902.95
              }],
              terms: sampleInvoiceDetails.terms
          };
    
          const invoiceRes = (await requestCreateInvoice(app, adminToken, invalidInvoiceDetails));
          expect(invoiceRes.status).toStrictEqual(400);
          expect(invoiceRes.body).toStrictEqual({ error: expect.any(String)});
      });
      
    // test('Due date is before issue date', async () => {
    //     const adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword , "Firstname", "Lastnane")).body.token;
    //     const companyId = (await requestCompanyRegister(app, adminToken, companyData)).body.companyId;
        
    //     const invalidInvoiceDetails = {
    //         companyId,
    //         sender: sampleInvoiceDetails.sender,
    //         receiver: sampleInvoiceDetails.receiver,
    //         issueDate: 1741394440,
    //         dueDate: 1731394440, 
    //         repeating: sampleInvoiceDetails.repeating,
    //         currency: sampleInvoiceDetails.currency,
    //         notes: sampleInvoiceDetails.notes,
    //         items: sampleInvoiceDetails.items,
    //         terms: sampleInvoiceDetails.terms
    //     };
    
    //     const invoiceRes = (await requestCreateInvoice(app, adminToken, invalidInvoiceDetails));
    //     expect(invoiceRes.status).toStrictEqual(400);
    //     expect(invoiceRes.body).toStrictEqual({ error: expect.any(String)});
    // });
    

    // test('Sender or receiver have missing details', async () => {
    //     const companyId = (await requestCompanyRegister(app, companyData)).body.companyId;
    //     const adminToken = (await requestUserLogin(app, companyData.companyEmail, companyData.password)).body.token;
        
    //     const invalidInvoiceDetails = {
    //         companyId,
    //         receiver: sampleInvoiceDetails.receiver,
    //         issueDate: sampleInvoiceDetails.issueDate,
    //         dueDate: sampleInvoiceDetails.dueDate,
    //         repeating: sampleInvoiceDetails.repeating,
    //         currency: sampleInvoiceDetails.currency,
    //         notes: sampleInvoiceDetails.notes,
    //         items: sampleInvoiceDetails.items,
    //         terms: sampleInvoiceDetails.terms
    //     };
    
    //     const invoiceRes = (await requestCreateInvoice(app, adminToken, invalidInvoiceDetails));
    //     expect(invoiceRes.status).toStrictEqual(400);
    //     expect(invoiceRes.body).toStrictEqual({ error: expect.any(String) });
    // });
    

    // test('Invoice must have at least one valid item/item has to be valid', async () => {
    //     const companyId = (await requestCompanyRegister(app, companyData)).body.companyId;
    //     const adminToken = (await requestUserLogin(app, companyData.companyEmail, companyData.password)).body.token;
        
    //     const emptyItemlist = [{}]
    //     const invalidInvoiceDetails = {
    //         companyId,
    //         sender: sampleInvoiceDetails.sender,
    //         receiver: sampleInvoiceDetails.receiver,
    //         issueDate: sampleInvoiceDetails.issueDate,
    //         dueDate: sampleInvoiceDetails.dueDate,
    //         repeating: sampleInvoiceDetails.repeating,
    //         currency: sampleInvoiceDetails.currency,
    //         notes: sampleInvoiceDetails.notes,
    //         items: emptyItemlist,
    //         terms: sampleInvoiceDetails.terms
    //     };
    
    //     const invoiceRes = (await requestCreateInvoice(app, adminToken, invalidInvoiceDetails));
    //     expect(invoiceRes.status).toStrictEqual(400);
    //     expect(invoiceRes.body).toStrictEqual({ error: expect.any(String) });
    // });

});
