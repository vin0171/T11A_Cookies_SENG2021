import { string } from 'yaml/dist/schema/common/string';
import createServer from '../../server';
import { requestClear, requestUserRegister, requestAuthLogin, requestAuthLogout } from '../testhelpers';

const app = createServer();

beforeEach(async () => {
  await requestClear(app);
});

afterEach(async () => {
  await requestClear(app);
});

describe('adminAuthLogout', () => {
    let token1: string;
    let token2: string;

    const email1 = 'dasda@gmail.com' as string;
    const password1 = 'Hello123' as string;
  
    const email2 = 'washed@gmail.com' as string;
    const password2 = 'Hello456' as string;
  
  beforeEach(async () => {
    token1 = (await requestUserRegister(app, email1, password1 , 'Jane', 'Doe')).body.token;
    token2 = (await requestUserRegister(app, email2, password2, 'Jane', 'Doe')).body.token;
  });

  test('error: email does not exist', async () => {
    const response = await requestAuthLogout(app, "");
    expect(response.status).toStrictEqual(400);
  });

  test('All params correct - logout an admin', async () => {
    const response = await requestAuthLogout(app, token1);
    expect(response.body).toStrictEqual({ });
    expect(response.status).toStrictEqual(200);
  });

  test('Attempt invalid logout when admin already logged out', async () => {
    await requestAuthLogout(app, token1);
    const response = await requestAuthLogout(app, token1);
    expect(response.status).toStrictEqual(401);
    expect(response.body).toStrictEqual({ error: expect.any(String) });
  });

  test('All params correct - logout, login, logout an admin', async () => {
    await requestAuthLogout(app, token1);
    const newToken1 = (await requestAuthLogin(app, email1, password1)).body.token as string;
    const response = await requestAuthLogout(app, newToken1);
    expect(response.body).toStrictEqual({});
    expect(response.status).toStrictEqual(200);
  });

  test('Logout, login, logout an admin after others do the same, then try invalid logout', async () => {
    await requestAuthLogout(app, token1);
    await requestAuthLogout(app, token2);
    const newToken1 = (await requestAuthLogin(app, email1, password1)).body.token as string;
    const newToken2 = (await requestAuthLogin(app, email2, password2)).body.token as string;

    await requestAuthLogout(app, newToken1);
    await requestAuthLogout(app, newToken2);
    const response = await requestAuthLogout(app, newToken2);
    expect(response.body).toStrictEqual({ error: expect.any(String) });
    expect(response.status).toStrictEqual(200);

  });


 
});
