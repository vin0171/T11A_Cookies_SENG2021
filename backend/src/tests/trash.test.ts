// import createServer from '../../server';
// import request from 'supertest';
// import { requestClear, requestCompanyRegister, requestCreateInvoice, requestUserLogin, requestUserRegister } from '../testhelpers';
// import { companyData, sampleInvoiceDetails } from '../sampleTestData';

// const app = createServer();

// beforeEach(async () => {
//     await requestClear(app);
// });

// afterEach(async () => {
//     await requestClear(app);
// });

// describe('Invoice Trash Functionality', () => {
//     let adminToken: string;
//     let companyId: string;
//     let invoiceId: string;

//     beforeEach(async () => {
//         companyId = (await requestCompanyRegister(app, companyData)).body.companyId;
//         adminToken = (await requestUserLogin(app, companyData.email, companyData.password)).body.token;

//         const invoiceDetails = { companyId, ...sampleInvoiceDetails };
//         invoiceId = (await requestCreateInvoice(app, adminToken, invoiceDetails)).body.invoiceId;
//     });

//     test('Successfully move an invoice to trash', async () => {
//         const response = await request(app)
//             .put(`/v1/invoice/${invoiceId}/edit/status`)
//             .set('Authorization', `Bearer ${adminToken}`)
//             .send({ status: 'trash' });

//         expect(response.status).toStrictEqual(200);
//         expect(response.body).toStrictEqual({});
//     });

//     test('Retrieve trashed invoices', async () => {
//         await request(app)
//             .put(`/v1/invoice/${invoiceId}/edit/status`)
//             .set('Authorization', `Bearer ${adminToken}`)
//             .send({ status: 'trash' });

//         const response = await request(app)
//             .get('/v1/invoice/list/trash')
//             .set('Authorization', `Bearer ${adminToken}`);

//         expect(response.status).toStrictEqual(200);
//         expect(response.body.invoices).toEqual(
//             expect.arrayContaining([{ invoiceId: expect.any(String) }])
//         );
//     });

//     test('Prevent actions on trashed invoices', async () => {
//         await request(app)
//             .put(`/v1/invoice/${invoiceId}/edit/status`)
//             .set('Authorization', `Bearer ${adminToken}`)
//             .send({ status: 'trash' });

//         const response = await request(app)
//             .put(`/v1/invoice/${invoiceId}/edit/details`)
//             .set('Authorization', `Bearer ${adminToken}`)
//             .send({ notes: 'Updated Notes' });

//         expect(response.status).toStrictEqual(400);
//         expect(response.body.error).toBe('Cannot edit a trashed invoice');
//     });

//     test('Empty trash and permanently delete invoices', async () => {
//         await request(app)
//             .put(`/v1/invoice/${invoiceId}/edit/status`)
//             .set('Authorization', `Bearer ${adminToken}`)
//             .send({ status: 'trash' });

//         const emptyTrashResponse = await request(app)
//             .delete('/v1/invoice/trash/empty')
//             .set('Authorization', `Bearer ${adminToken}`);

//         expect(emptyTrashResponse.status).toStrictEqual(200);
//         expect(emptyTrashResponse.body).toStrictEqual({});

//         const retrieveResponse = await request(app)
//             .get(`/v1/invoice/${invoiceId}`)
//             .set('Authorization', `Bearer ${adminToken}`);

//         expect(retrieveResponse.status).toStrictEqual(404);
//         expect(retrieveResponse.body.error).toBe('Invoice not found');
//     });
// });
