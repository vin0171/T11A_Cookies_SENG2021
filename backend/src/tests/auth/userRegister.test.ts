import createServer from '../../server';
jest.useFakeTimers()
import { requestUserRegister, requestClear } from '../testhelpers';

const app = createServer();

beforeEach(async () => {
  await requestClear(app);
});

beforeEach(async () => {
  await requestClear(app);
});

describe('userAuthRegister', () => {

  test.each([
    {
      email: 'invalidemail',
      password: 'abc123123',
      nameFirst: 'John',
      nameLast: 'Smith'
    },
    {
      email: 'john@gmail.com',
      password: 'abc123',
      nameFirst: 'John',
      nameLast: 'Smith'
    },
    {
      email: 'john@gmail.com',
      password: 'abcdefghijkl',
      nameFirst: 'John',
      nameLast: 'Smith'
    },
    {
      email: 'john@gmail.com',
      password: '123456789',
      nameFirst: 'John',
      nameLast: 'Smith'
    },
    {
      email: 'john@gmail.com',
      password: 'abc123123',
      nameFirst: 'j',
      nameLast: 'Smith'
    },
    {
      email: 'john@gmail.com',
      password: 'abc123123',
      nameFirst: 'J@hn',
      nameLast: 'Smith'
    },
    {
      email: 'john@gmail.com',
      password: 'abc123123',
      nameFirst: 'John',
      nameLast: 'Sm|th'
    },
  ])('error checks for invalid password, first name, last name and email', 
    async ({ email, password, nameFirst, nameLast }) => {
      const response = await requestUserRegister(app, email, password, nameFirst, nameLast);
      expect(response.status).toStrictEqual(400);
      expect(response.body.error).toBe(expect.any(String));
  });

  test('error: email already exists', async () => {
    await requestUserRegister(app, 'test@gmail.com', 'def456456', 'Jane', 'Doe');
    const response = await requestUserRegister(app, 'test@gmail.com', 'newpassword', 'John', 'Smith');
    expect(response.status).toStrictEqual(400);
    expect(response.body.error).toBe(expect.any(String));
  });

  test('successful registration', async () => {
    const response = await requestUserRegister(app, 'test@gmail.com', 'abc123123', 'John John-John', 'O\'Smith');
    expect(response.body).toStrictEqual({ token: expect.any(String) });
    expect(response.status).toStrictEqual(200);
    expect(response.header['content-type']).toContain('application/json');
  });

  test('multiple successful registrations', async () => {
    await requestUserRegister(app, 'test@gmail.com', 'abc123123', 'John', 'Smith');
    await requestUserRegister(app, 'test2@gmail.com', 'abc123123', 'John', 'Smith');
    const response = await requestUserRegister(app, 'test@gmail.com', 'abc123123', 'John John-John', 'O\'Smith');
    expect(response.body).toStrictEqual({ token: expect.any(String) });
    expect(response.status).toStrictEqual(200);
    expect(response.header['content-type']).toContain('application/json');
  });
});

