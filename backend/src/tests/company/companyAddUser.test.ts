import createServer from "../../server";
import { requestCompanyAddUser, requestCompanyRegister } from "../testhelpers";
const app = createServer();


describe('companyAddUser', () => {
    test('Successfully add singular', async () => {
        const companyData = {
            name: 'Tech Corp',
            address: '123 Tech Street',
            city: 'San Francisco',
            state: 'CA',
            postcode: '94105',
            phone: '123-456-7890',
            email: 'info@techcorp.com',
            password: 'securePassword123',
          };
        const companyResponse = await requestCompanyRegister(app, companyData);
        expect(companyResponse.status).toStrictEqual(200);
        const companyId = companyResponse.body.companyId;
    });

    // test('Successfully add users multiple', async () => {
    // });


    test('No such company found in system', async () => {
        const invalidEmail = 'invalid-email';
        const response = await requestCompanyAddUser(app, invalidEmail);
        expect(response.status).toStrictEqual(400);
        expect(response.body).toStrictEqual({ error: expect.any(String) });
    });


    // test('No such user found in system', async () => {
    // });
    // test('User is already in the system', async () => {
    // });
    // test('Current user is unauthorised to add another user', async () => {
    // });
});