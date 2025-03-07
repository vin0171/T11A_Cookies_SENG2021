import createServer from '../../server';
import { requestClear, requestCompanyRegister } from '../testhelpers';

const app = createServer();

beforeEach(async () => {
  await requestClear(app);
});

afterEach(async () => {
  await requestClear(app);
});


describe('companyRegister', () => {
    test('Sucesfully registers a company', async () => {
        const companyData = {
            name: 'Tech Corp',
            address: '123 Tech Street',
            city: 'San Francisco',
            state: 'CA',
            postcode: '94105',
            phone: '123-456-7890',
            email: 'info@techcorp.com',
            password: '123fsddsfdsf3', 
        };
        const response = await requestCompanyRegister(app, companyData);
        expect(response.status).toStrictEqual(200);
        expect(response.body).toStrictEqual({ companyId: expect.any(Number)});
    });

    test('Sucesfully registers multple company', async () => {
        let companyIds: Set<number>;
        let companyData = {
            name: 'Tech Corp',
            address: '123 Tech Street',
            city: 'San Francisco',
            state: 'CA',
            postcode: '94105',
            phone: '123-456-7890',
            email: 'info@techcorp.com',
            password: '123fsddsfdsf3', 
        };
        const response = await requestCompanyRegister(app, companyData);
        expect(response.status).toStrictEqual(200);
        expect(response.body).toStrictEqual({ companyId: expect.any(Number)});

        companyData.name = 'This is so broing'
        companyData.email = 'info@techcorop2.com'
        const response2 = await requestCompanyRegister(app, companyData);
        expect(response2.status).toStrictEqual(200);
        expect(response2.body).toStrictEqual({ companyId: expect.any(Number)});
        const companyId = response2.body.companyId;
        companyData.name = 'This is so broing 2'
        companyData.email = 'info@techcorop2.com2222'
        const response3 = await requestCompanyRegister(app, companyData);
        expect(response3.status).toStrictEqual(200);
        expect(response3.body).toStrictEqual({ companyId: expect.any(Number)});

        const companyId1 = response.body.companyId;
        const companyId2 = response2.body.companyId;
        const companyId3 = response3.body.companyId;
        companyIds.add(companyId1);
        companyIds.add(companyId2);
        companyIds.add(companyId3);
        expect(companyIds.size).toBe(3);

    });


    test('Extremely long input', async () => {
        const companyData = {
          name: 'A'.repeat(1000), // Extremely long name
          address: '123 Tech Street',
          city: 'San Francisco',
          state: 'CA',
          postcode: '94105',
          phone: '123-456-7890',
          email: 'info@techcorp.com',
          password: 'securePassword123',
        };
      
        const response = await requestCompanyRegister(app, companyData);
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(expect.any(String));
    });


    test('Duplicate company emails', async () => {
        const companyData1 = {
          name: 'Tech Corp',
          address: '123 Tech Street',
          city: 'San Francisco',
          state: 'CA',
          postcode: '94105',
          phone: '123-456-7890',
          email: 'info@techcorp.com',
          password: 'securePassword123',
        };
      
        // Register the first company
        await requestCompanyRegister(app, companyData1);
      
        const response = await requestCompanyRegister(app, companyData1);
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(expect.any(String));
    });

    test('Weak password status code 400', async () => {
        const companyData = {
          name: 'Tech Corp',
          address: '123 Tech Street',
          city: 'San Francisco',
          state: 'CA',
          postcode: '94105',
          phone: '123-456-7890',
          email: 'info@techcorp.com',
          password: '123', // Weak password
        };
        const response = await requestCompanyRegister(app, companyData);
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(expect.any(String));
    });


});