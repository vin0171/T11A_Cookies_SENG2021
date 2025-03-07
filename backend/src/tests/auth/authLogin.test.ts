import createServer from '../../server';
import { requestClear, requestUserRegister, requestAuthLogin } from '../testhelpers';

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

  test('error: email does not exist', async () => {
    const response = await requestAuthLogin(app, 'test3@gmail.com', 'def456456');
    expect(response.status).toStrictEqual(400);
  });

  test('error: incorrect password', async () => {
    const response = await requestAuthLogin(app, 'test@gmail.com', 'abc123123');
    expect(response.status).toStrictEqual(400);
  });

  test('logging in successfully', async () => {
    const response = await requestAuthLogin(app, 'test@gmail.com', 'def456456');
    expect(response.body).toStrictEqual({ token: expect.any(String) });
    expect(response.status).toStrictEqual(200);
  });

  test('logging in successfully for multiple users', async () => {
    await requestAuthLogin(app, 'test@gmail.com', 'def456456');
    const response = await requestAuthLogin(app, 'test2@gmail.com', 'abc123123');
    expect(response.body).toStrictEqual({ token: expect.any(String) });
    expect(response.status).toStrictEqual(200);
  });

  test('Unique token strings that are obscured', async () => {
    const tokenArray = [];
    tokenArray.push((await requestAuthLogin(app, 'test@gmail.com', 'def456456')).body.token);
    tokenArray.push((await requestAuthLogin(app, 'test2@gmail.com', 'abc123123')).body.token);
    tokenArray.push((await requestAuthLogin(app, 'test2@gmail.com', 'abc123123')).body.token);
    tokenArray.push((await requestAuthLogin(app, 'test2@gmail.com', 'abc123123')).body.token);
    const uniqueTokens = Array.from(new Set(tokenArray));
    expect(uniqueTokens).toHaveLength(4);
  });
});
