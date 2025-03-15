import { companyRequestBody } from '../../interface';
import createServer from '../../server';
import { requestClear, requestCompanyRegister, requestUserRegister } from '../testhelpers';

const app = createServer();

beforeEach(async () => {
  await requestClear(app);
});

afterEach(async () => {
  await requestClear(app);
});


let token: string;

describe('companyRegister', () => {

  beforeEach(async () => {
    token = (await requestUserRegister(app, "adminOfCompanyEmail@gmail.com", "adminOfCompanyPw@gmail.com122", "Valid", "Name")).body.token;
  });

    test('Sucesfully registers a company', async () => {
      const companyData: companyRequestBody = {
        companyName: 'Tech Corp',
        companyAbn: '12345678901',  
        companyEmail: 'adminOfCompanyEmail@gmail.com',
        contactNumber: '1234567890',
        address: '123 Tech Street',
        city: 'San Francisco',
        state: 'CA',
        postcode: '94105',
        country: 'USA',  
      };
      
        const response = await requestCompanyRegister(app, token, companyData);
        expect(response.body).toStrictEqual({ companyId: expect.any(String)});
        expect(response.status).toStrictEqual(200);
    });

    test('Sucesfully registers multple company', async () => {
        let companyData: companyRequestBody = {
          companyName: 'Tech Corp',
          companyAbn: '12345678901',  
          companyEmail: 'adminOfCompanyEmail@gmail.com',
          contactNumber: '1234567890',
          address: '123 Tech Street',
          city: 'San Francisco',
          state: 'CA',
          postcode: '94105',
          country: 'USA',  
        };
        
        const response = await requestCompanyRegister(app, token, companyData);
        expect(response.status).toStrictEqual(200);
        expect(response.body).toStrictEqual({ companyId: expect.any(String)});

        companyData.companyName = 'Turple Corp'
        companyData.companyEmail = 'info@techcorop2.com'
        const token1 = (await requestUserRegister(app, "info@techcorop2.com", "adminOfCompanyPw@gmail.com122", "Valid", "Name")).body.token;
        const response2 = await requestCompanyRegister(app, token1, companyData);
        expect(response2.status).toStrictEqual(200);
        expect(response2.body).toStrictEqual({ companyId: expect.any(String)});
        companyData.companyName = 'Turple Tech'
        companyData.companyEmail = 'info@techcorop1.com'
        const token2 = (await requestUserRegister(app, "info@techcorop1.com", "adminOfCompanyPw@gmail.com122", "Valid", "Name")).body.token;
        const response3 = await requestCompanyRegister(app, token2, companyData);
        expect(response3.body).toStrictEqual({ companyId: expect.any(String)});
        expect(response3.status).toStrictEqual(200);

        const companyId1 = response.body.companyId;
        const companyId2 = response2.body.companyId;
        const companyId3 = response3.body.companyId;
        
        let companyIds = new Set<string>();  
        
        companyIds.add(companyId1);  
        companyIds.add(companyId2); 
        companyIds.add(companyId3);  
        
        expect(companyIds.size).toStrictEqual(3); 
        

    });

    test('Duplicate company emails', async () => {
      const companyData: companyRequestBody = {
        companyName: 'Tech Corp',
        companyAbn: '12345678901',  
        companyEmail: 'adminOfCompanyEmail@gmail.com',
        contactNumber: '1234567890',
        address: '123 Tech Street',
        city: 'San Francisco',
        state: 'CA',
        postcode: '94105',
        country: 'USA',  
      };
        // Register the first company
        await requestCompanyRegister(app, token, companyData);
      
        const response = await requestCompanyRegister(app, token, companyData);
        expect(response.status).toStrictEqual(400);
        expect(response.body.error).toStrictEqual(expect.any(String));
    });
});