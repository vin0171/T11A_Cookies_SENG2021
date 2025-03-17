import { time } from 'console';
import createServer from '../../server';
import { requestClear, requestUserRegister, requestUserLogin } from '../testhelpers';
const app = createServer();

beforeEach(async () => {
  await requestClear(app);
});

afterEach(async () => {
  await requestClear(app);
});

describe('adminAuthLogin', () => {
  beforeEach(async () => {
    await requestUserRegister(app, 'test@gmail.com', 'def456456', 'Jane', 'Doe');
    await requestUserRegister(app, 'test2@gmail.com', 'abc123123', 'John', 'Smith');
  });

  test('error: email is not valid', async () => {
    const response = await requestUserLogin(app, 'test2com', 'def456456');
    expect(response.status).toStrictEqual(400);
    expect(response.body).toStrictEqual({error: expect.any(String)});
  });


  test('error: email does not exist', async () => {
    const response = await requestUserLogin(app, 'test3@gmail.com', 'def456456');
    expect(response.status).toStrictEqual(400);
    expect(response.body).toStrictEqual({error: expect.any(String)});
  });

  test('error: incorrect password', async () => {
    const response = await requestUserLogin(app, 'test@gmail.com', 'abc123123');
    expect(response.status).toStrictEqual(400);
    expect(response.body).toStrictEqual({error: expect.any(String)});
  });

  test('logging in successfully', async () => {
    const response = await requestUserLogin(app, 'test@gmail.com', 'def456456');
    expect(response.body).toStrictEqual(expect.any(String));
    expect(response.status).toStrictEqual(200);
  });

  test('logging in successfully for multiple users', async () => {
    await requestUserLogin(app, 'test@gmail.com', 'def456456');
    const response = await requestUserLogin(app, 'test2@gmail.com', 'abc123123');
    expect(response.body).toStrictEqual(expect.any(String));
    expect(response.status).toStrictEqual(200);
  });
  
  test('Unique token strings that are obscured', async () => {
    let token1 = (await requestUserLogin(app, 'test@gmail.com', 'def456456')).body;
    let token2 = (await requestUserLogin(app, 'test2@gmail.com', 'abc123123')).body;
    expect(token1).not.toBe(token2);
  });
});


