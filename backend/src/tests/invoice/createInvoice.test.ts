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


describe('createInvoice tests', () => {
    test('Creates an invoice for company from JSON document', async () => {
        const companyId = (await requestCompanyRegister(app, companyData)).body.companyId;
        const adminToken = (await requestUserLogin(app, companyData.email, companyData.password)).body.token;
        // Add the companyId that owns the invoice
        const invoiceDetails = {companyId, ...sampleInvoiceDetails}
        const invoiceRes = (await requestCreateInvoice(app, adminToken, invoiceDetails));

        const expectedResponse = { invoiceId: expect.any(Number) };
        expect(invoiceRes.body).toStrictEqual(expectedResponse);
        expect(invoiceRes.status).toStrictEqual(200);
    });

    // test('Create an invoice from a UBL formatted document', async () => {
    //     // TODO: Implement test logic
    // });

    test('Cannot create an invoice from a company you do not own', async () => {
        const companyId = (await requestCompanyRegister(app, companyData)).body.companyId;
        const userToken = (await requestUserLogin(app, 'bitshift@gmail.com', 'companyData.@12password')).body.token;
        // Add the companyId that owns the invoice
        const invoiceDetails = {companyId, ...sampleInvoiceDetails}
        const invoiceRes = (await requestCreateInvoice(app, userToken, invoiceDetails));
        expect(invoiceRes.body).toStrictEqual({ error: expect.any(String)});
        expect(invoiceRes.status).toStrictEqual(403);
    });

    test('Creating multiple invoices for one company', async () => {
        const companyId = (await requestCompanyRegister(app, companyData)).body.companyId;
        const adminToken = (await requestUserLogin(app, companyData.email, companyData.password)).body.token;
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
        const companyId = (await requestCompanyRegister(app, companyData)).body.companyId;
        const adminToken = (await requestUserLogin(app, companyData.email, companyData.password)).body.token;
        // Add the companyId that owns the invoice
        const invoiceDetails = {companyId, ...sampleInvoiceDetails};
        const invoiceDetails1 = {companyId, ...sampleInvoiceDetails1};
        let invoiceRes = (await requestCreateInvoice(app, adminToken, invoiceDetails));
        expect(invoiceRes.status).toStrictEqual(200);
        invoiceRes = (await requestCreateInvoice(app, adminToken, invoiceDetails1));
        expect(invoiceRes.status).toStrictEqual(200);

        let companyClone = companyData;
        companyClone.email = 'adminOfCompanyEmail2@gmail.com'
        companyClone.name = 'Turple Industried. Inc'
        const companyId1 = (await requestCompanyRegister(app, companyClone)).body.companyId;
        const adminToken1 = (await requestUserLogin(app, companyClone.email, companyClone.password)).body.token;
        const invoiceDetails2 = {companyId1, ...sampleInvoiceDetails}
        const invoiceDetails3 = {companyId1, ...sampleInvoiceDetails1}
        let invoiceRes1 = (await requestCreateInvoice(app, adminToken1, invoiceDetails2));
        expect(invoiceRes1.status).toStrictEqual(200);  

        let invoiceRes2 = (await requestCreateInvoice(app, adminToken1, invoiceDetails3));
        expect(invoiceRes2.status).toStrictEqual(200);  
    });

    test('Check for unique invoice IDs returned', async () => {
        const invoiceArray = [];
        const companyId = (await requestCompanyRegister(app, companyData)).body.companyId;
        const adminToken = (await requestUserLogin(app, companyData.email, companyData.password)).body.token;
        // Add the companyId that owns the invoice
        const invoiceDetails = {companyId, ...sampleInvoiceDetails}
        const invoiceDetails1 = {companyId, ...sampleInvoiceDetails1}
        const invoiceDetails2 = {companyId, ...sampleInvoiceDetails2}
        invoiceArray.push((await requestCreateInvoice(app, adminToken, invoiceDetails)).body.token);
        invoiceArray.push((await requestCreateInvoice(app, adminToken, invoiceDetails1)).body.token);
        invoiceArray.push((await requestCreateInvoice(app, adminToken, invoiceDetails2)).body.token);

        const uniqueTokens = Array.from(new Set(invoiceArray));
        expect(uniqueTokens).toHaveLength(3);
    });

    test('Trying to create an invoice for a non-existent company', async () => {
        const companyId = 31231231;
        const invoiceDetails = {companyId, ...sampleInvoiceDetails};
        const userToken = (await requestUserRegister(app, 'valid@gmail.com', 'val2131id@gmail.com', 'valid', 'invalid')).body.token;
        let invoiceRes = (await requestCreateInvoice(app, userToken, invoiceDetails));
        expect(invoiceRes.status).toStrictEqual(401);
        expect(invoiceRes.body).toStrictEqual({ error: expect.any(String)});
    });

    test.each([
        ['quantity', -9],
        ['unitPrice', -324.38],
        ['discountAmount', -43.9],
        ['taxAmount', -42.07],
        ['taxRate', -15],
        ['totalAmount', -2902.95]
      ])('Negative amount for %s should return an error', async (field, invalidValue) => {
          const companyId = (await requestCompanyRegister(app, companyData)).body.companyId;
          const adminToken = (await requestUserLogin(app, companyData.email, companyData.password)).body.token;
      
          const invalidInvoiceDetails = {
              companyId,
              sender: sampleInvoiceDetails.sender,
              receiver: sampleInvoiceDetails.receiver,
              issueDate: sampleInvoiceDetails.issueDate,
              dueDate: sampleInvoiceDetails.dueDate,
              repeating: sampleInvoiceDetails.repeating,
              currency: sampleInvoiceDetails.currency,
              notes: sampleInvoiceDetails.notes,
              items: [{
                  itemSku: "SKU7984",
                  itemName: "Product Beta",
                  description: "Description for Product Beta",
                  quantity: field === 'quantity' ? invalidValue : 9,
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
      
    test('Due date is before issue date', async () => {
        const companyId = (await requestCompanyRegister(app, companyData)).body.companyId;
        const adminToken = (await requestUserLogin(app, companyData.email, companyData.password)).body.token;
        
        const invalidInvoiceDetails = {
            companyId,
            sender: sampleInvoiceDetails.sender,
            receiver: sampleInvoiceDetails.receiver,
            issueDate: 1741394440,
            dueDate: 1731394440, 
            repeating: sampleInvoiceDetails.repeating,
            currency: sampleInvoiceDetails.currency,
            notes: sampleInvoiceDetails.notes,
            items: sampleInvoiceDetails.items,
            terms: sampleInvoiceDetails.terms
        };
    
        const invoiceRes = (await requestCreateInvoice(app, adminToken, invalidInvoiceDetails));
        expect(invoiceRes.status).toStrictEqual(400);
        expect(invoiceRes.body).toStrictEqual({ error: expect.any(String)});
    });
    

    test('Sender or receiver have missing details', async () => {
        const companyId = (await requestCompanyRegister(app, companyData)).body.companyId;
        const adminToken = (await requestUserLogin(app, companyData.email, companyData.password)).body.token;
        
        const invalidInvoiceDetails = {
            companyId,
            receiver: sampleInvoiceDetails.receiver,
            issueDate: sampleInvoiceDetails.issueDate,
            dueDate: sampleInvoiceDetails.dueDate,
            repeating: sampleInvoiceDetails.repeating,
            currency: sampleInvoiceDetails.currency,
            notes: sampleInvoiceDetails.notes,
            items: sampleInvoiceDetails.items,
            terms: sampleInvoiceDetails.terms
        };
    
        const invoiceRes = (await requestCreateInvoice(app, adminToken, invalidInvoiceDetails));
        expect(invoiceRes.status).toStrictEqual(400);
        expect(invoiceRes.body).toStrictEqual({ error: expect.any(String) });
    });
    

    test('Invoice must have at least one valid item/item has to be valid', async () => {
        const companyId = (await requestCompanyRegister(app, companyData)).body.companyId;
        const adminToken = (await requestUserLogin(app, companyData.email, companyData.password)).body.token;
        
        const emptyItemlist = [{}]
        const invalidInvoiceDetails = {
            companyId,
            sender: sampleInvoiceDetails.sender,
            receiver: sampleInvoiceDetails.receiver,
            issueDate: sampleInvoiceDetails.issueDate,
            dueDate: sampleInvoiceDetails.dueDate,
            repeating: sampleInvoiceDetails.repeating,
            currency: sampleInvoiceDetails.currency,
            notes: sampleInvoiceDetails.notes,
            items: emptyItemlist,
            terms: sampleInvoiceDetails.terms
        };
    
        const invoiceRes = (await requestCreateInvoice(app, adminToken, invalidInvoiceDetails));
        expect(invoiceRes.status).toStrictEqual(400);
        expect(invoiceRes.body).toStrictEqual({ error: expect.any(String) });
    });

});
