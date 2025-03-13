import createServer from "../../server";
import { requestUserLogin, requestCompanyAddUser, requestCompanyRegister, requestUserRegister, requestClear } from "../testhelpers";
const app = createServer();

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

beforeEach(async () => {
    await requestClear(app);
});

afterEach(async () => {
    await requestClear(app);
});

describe('companyAddUser', () => {
    beforeEach(async () => {
        await requestUserRegister(app, 'test@gmail.com', 'def456456', 'Jane', 'Doe');
        await requestUserRegister(app, 'test2@gmail.com', 'abc123123', 'John', 'Smith');
    });

    test('Successfully add singular user', async () => {
        const companyResponse = await requestCompanyRegister(app, companyData);
        expect(companyResponse.status).toStrictEqual(200);
        const companyId = companyResponse.body.companyId;
        // Admin has to log in after making the account 
        const adminToken = (await requestUserLogin(app,companyData.email, companyData.password)).body.token;
        // Creation of a user
        await requestUserRegister(app, 'omg@techcorp.com', 'verySecurePassword@123', "nodetravesal", "notsofree");
        const addUserResponse = await requestCompanyAddUser(app, adminToken, companyId,'omg@techcorp.com');
        expect(addUserResponse.status).toStrictEqual(200);
        expect(addUserResponse.body).toStrictEqual({});
    });

    test('Add multiple users ', async () => {
        const companyResponse = await requestCompanyRegister(app, companyData);
        const companyId = companyResponse.body.companyId;
        const adminToken = (await requestUserLogin(app,companyData.email, companyData.password)).body.token;
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
        const token = (await requestUserRegister(app, 'omg@techcorp.com', 'verySecurePassword@123', "nodetravesal", "notsofree")).body.token;
        await requestUserRegister(app, 'omgs@techcorp.com', 'verySecurePassword@123', "nodetravesal", "notsofree");
        const invalidCompanyId = '2131231231331';
        const response = await requestCompanyAddUser(app, token, invalidCompanyId, 'omgs@techcorp.com');
        expect(response.status).toStrictEqual(400);
        expect(response.body).toStrictEqual({ error: expect.any(String) });
    });

    test('No such user found in system', async () => {
        const companyResponse = await requestCompanyRegister(app, companyData);
        const companyId = companyResponse.body.companyId;
        // Admin has to log in after making the account 
        const adminToken = (await requestUserLogin(app,companyData.email, companyData.password)).body.token;
        const addUserResponse = await requestCompanyAddUser(app, adminToken, companyId,'omg@techcorp.com');
        expect(addUserResponse.status).toStrictEqual(400);
        expect(addUserResponse.body).toStrictEqual({ error: expect.any(String) });
    });
    
    test('User is already in the system', async () => {
        const companyResponse = await requestCompanyRegister(app, companyData);
        const companyId = companyResponse.body.companyId;
        // Admin has to log in after making the account 
        const adminToken = (await requestUserLogin(app,companyData.email, companyData.password)).body.token;
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
        const companyResponse = await requestCompanyRegister(app, companyData);
        const companyId = companyResponse.body.companyId;
        // Admin has to log in after making the account 
        const adminToken = (await requestUserLogin(app,companyData.email, companyData.password)).body.token;
        // Creation of a user
        const userToken = (await requestUserRegister(app, 'omg@techcorp.com', 'verySecurePassword@123', "nodetravesal", "notsofree")).body.token;
        // Literally trying to add urself to the company must fail
        const addUserResponse = await requestCompanyAddUser(app, userToken, companyId,'omg@techcorp.com');
        expect(addUserResponse.status).toStrictEqual(401);
        expect(addUserResponse.body).toStrictEqual({error: expect.any(String)});
    });
});
