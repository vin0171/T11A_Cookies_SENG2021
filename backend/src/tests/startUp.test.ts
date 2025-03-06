// These tests are purely to test if the server is able to start up with the swagger docs loaded
import request from 'supertest';
import createServer from '../server';

describe('Server Startup ECHO HTTP tests using Jest and Supertest', () => {
    test('Test successful Server start up', async () => {
        const app = createServer()
        const response = await request(app).post('/echo')
        expect(response.text).toEqual("POST request to the homepage");
        expect(response.status).toEqual(200);
    });

    // test('Test successful Server start up for docs', async () => {
    //     const response = await request(createServer()).post('/echo')
    //     console.log(response.text)
    //     expect(response.status).toEqual(200);
    // });
});
  