import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from './config.json';
// import errorHandler from 'middleware-http-errors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path, { parse } from 'path';
import process from 'process';
import * as invoices from './invoices';
import * as companies from './companies';
import * as users from './users';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(express.json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));

const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
app.get('/', sui.serve, sui.setup(YAML.parse(file)));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';
// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

app.post('/data', (req: Request, res: Response): void => {
  const receivedData = req.body;
  res.json({ message: 'Data received', data: receivedData });
});

// Set the server to listen on a port
app.listen(PORT, HOST, () => {
    console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
    const url = `http://localhost:${PORT}/docs`;
    console.log(`Example app listening at ${url}`);
    console.log('Control+C to quit the app')
});


// ========================================================================= //
// Iteration 1 
// ========================================================================= //

app.post('/v1/user/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const response = users.registerUser(email, password, nameFirst, nameLast);

  res.json("Not Implemented");
});

app.post('/v1/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const response = users.authLogin(email, password);

  res.json("Not Implemented");
});


app.post('/v1/auth/logout', (req: Request, res: Response) => {
  const { token } = req.body;
  const response = users.authLogout(token);

  res.json("Not Implemented");
});


app.post('/v1/company/register', (req: Request, res: Response) => {
  const { companyName, companyAbn, adminEmail, adminPassword, contactNumber } = req.body;
  const response = companies.registerCompany(companyName, companyAbn, adminEmail, adminPassword, contactNumber);

  res.json("Not Implemented");
});


app.put('/v1/company/user/add', (req: Request, res: Response) => {
  const { email } = req.body;
  const response = companies.addCompanyUser(email);

  res.json("Not Implemented");
});


app.post('/v1/invoice', (req: Request, res: Response) => {
  // change whatever
  const { sender, receiver, issueDate, dueDate } = req.body;
  const response = invoices.createInvoice();

  res.json("Not Implemented");
});


app.get('/v1/invoice/:invoiceId', (req: Request, res: Response) => {
  // change whatever
  const { sender, receiver, issueDate, dueDate } = req.body;
  const response = invoices.getInvoice();

  res.json("Not Implemented");
});


app.put('/v1/invoice/:invoiceId/edit/details', (req: Request, res: Response) => {
  // change whatever
  const { sender, receiver, issueDate, dueDate } = req.body;
  const response = invoices.editInvoiceDetails(token);

  res.json("Not Implemented");
});

app.put('/v1/invoice/:invoiceId/edit/status', (req: Request, res: Response) => {
  // change whatever
  const { token, status } = req.body;
  const response = invoices.editInvoiceStatus(token, status);

  res.json("Not Implemented");
});

// CHECK HAS TO be in Trash
app.delete('/v1/invoice/:invoiceId', (req: Request, res: Response) => {
  // change whatever
  const invoiceId = parseInt(req.params.invoiceId);
  const { token } = req.body;
  const response = invoices.deleteInvoice(token, invoiceId);

  res.json("Not Implemented");
});


app.get('/v1/invoice/list', (req: Request, res: Response) => {
  // change whatever
  const { sender, receiver, issueDate, dueDate } = req.body;
  const response = listCompanyInvoices();

  res.json("Not Implemented");
});







  
// The thing below causes memeory leaks for me lol
// // For coverage, handle Ctrl+C gracefully 
// process.on('SIGINT', () => {
//   server.close(() => console.log('Shutting down server gracefully.'));
// });
