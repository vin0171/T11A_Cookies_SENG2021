import createServer from "../../server";
import { companyData } from "../sampleTestData";
import { requestCompanyAddUser, requestCompanyRegister, requestUserRegister, requestClear } from "../testhelpers";
const app = createServer();

beforeEach(async () => {
    await requestClear(app);
});

afterEach(async () => {
    await requestClear(app);
});

const globalPassword = "adminOfCompanyPw@gmail.com122";
let adminToken: string;
describe('companyAddUser', () => {
    beforeEach(async () => {
        adminToken = (await requestUserRegister(app, companyData.companyEmail, globalPassword , "Valid", "Name")).body;
        await requestUserRegister(app, 'test@gmail.com', 'def456456', 'Jane', 'Doe');
        await requestUserRegister(app, 'test2@gmail.com', 'abc123123', 'John', 'Smith');
    });


    test('Successfully add singular user', async () => {
        const companyResponse = await requestCompanyRegister(app, adminToken, companyData);
        const companyId = companyResponse.body;
        expect(companyResponse.status).toStrictEqual(200);

        // Creation of a user
        await requestUserRegister(app, 'omg@techcorp.com', 'verySecurePassword@123', "nodetravesal", "notsofree");
        const addUserResponse = await requestCompanyAddUser(app, adminToken, companyId,'omg@techcorp.com');
        expect(addUserResponse.body).toStrictEqual({});
        expect(addUserResponse.status).toStrictEqual(200);
    });

    test('Add multiple users ', async () => {
        const companyResponse = await requestCompanyRegister(app, adminToken, companyData);
        const companyId = companyResponse.body;
        await requestUserRegister(app, 'omg@techcorp.com', 'verySecurePassword@123', "nodetravesal", "notsofree");
        await requestUserRegister(app, 'omsg@techcorp.com', 'verySecurePassword@123', "nodetravesal", "notsofree");
        await requestUserRegister(app, 'omscg@techcorp.com', 'verySecurePassword@123', "nodetravesal", "notsofree");
        const addUserResponse = await requestCompanyAddUser(app, adminToken, companyId,'omg@techcorp.com');
        expect(addUserResponse.status).toStrictEqual(200);
        expect(addUserResponse.body).toStrictEqual({});
        const addUser3Response = await requestCompanyAddUser(app, adminToken, companyId,'omscg@techcorp.com');
        expect(addUser3Response.status).toStrictEqual(200);
        expect(addUser3Response.body).toStrictEqual({});
    });


    test('No such company found in system', async () => {
        const token = (await requestUserRegister(app, 'omg@techcorp.com', 'verySecurePassword@123', "nodetravesal", "notsofree")).body;
        await requestUserRegister(app, 'omgs@techcorp.com', 'verySecurePassword@123', "nodetravesal", "notsofree");
        const invalidCompanyId = '2131231231331';
        const response = await requestCompanyAddUser(app, token, invalidCompanyId, 'omgs@techcorp.com');
        expect(response.status).toStrictEqual(400);
        expect(response.body).toStrictEqual({ error: expect.any(String) });
    });


    test('No such user found in system', async () => {
        const companyResponse = await requestCompanyRegister(app, adminToken, companyData);
        const companyId = companyResponse.body;
        const addUserResponse = await requestCompanyAddUser(app, adminToken, companyId,'omg@techcorp.com');
        expect(addUserResponse.status).toStrictEqual(400);
        expect(addUserResponse.body).toStrictEqual({ error: expect.any(String) });
    });
    
    test('User is already in the system', async () => {
        const companyResponse = await requestCompanyRegister(app, adminToken, companyData);
        const companyId = companyResponse.body;

        // Creation of a user
        await requestUserRegister(app, 'omg@techcorp.com', 'verySecurePassword@123', "nodetravesal", "notsofree");
        await requestCompanyAddUser(app, adminToken, companyId,'omg@techcorp.com');
        // Add USER AGAIN
        const addUserResponse = await requestCompanyAddUser(app, adminToken, companyId,'omg@techcorp.com');
        // I think its 400 not sure 
        expect(addUserResponse.status).toStrictEqual(400);
        expect(addUserResponse.body).toStrictEqual({error: expect.any(String)});

    });
    test('Current user is unauthorised to add another user', async () => {
        const companyResponse = await requestCompanyRegister(app, adminToken, companyData);
        const companyId = companyResponse.body;
        // Creation of a user
        const userToken = (await requestUserRegister(app, 'omg@techcorp.com', 'verySecurePassword@123', "nodetravesal", "notsofree")).body;
        // Literally trying to add urself to the company must fail
        const addUserResponse = await requestCompanyAddUser(app, userToken, companyId,'omg@techcorp.com');
        expect(addUserResponse.status).toStrictEqual(403);
        expect(addUserResponse.body).toStrictEqual({error: expect.any(String)});
    });
});
