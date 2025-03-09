import { Express, NextFunction, Request, Response } from "express";
import * as invoices from './invoices';
import * as companies from './companies';
import * as users from './users';
import * as Converter from './Converter';
import { saveDataStore, setData } from "./dataStore";
import { validateLocation } from "./validationHelpers";
import { Location } from "./interface";
// import errorHandler from 'middleware-http-errors';

function routes(app: Express) {
    app.post('/echo', (req: Request, res: Response) => {
        res.send('POST request to the homepage')
    })
// ========================================================================= //
// Iteration 1 
// ========================================================================= //

    app.delete('/v1/clear', async (req: Request, res: Response, next: NextFunction) => {
      setData({
        companies: [],
        users: [],
        invoices: [],
        sessions: [],
        otherData: {companiesCount: 0, userCount: 0, invoiceCount: 0, sessionCount: 0}});
      res.status(200).json({})
    })
    
    app.post('/v1/user/register', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password, nameFirst, nameLast, age } = req.body;
        const response = users.registerUser(email, password, nameFirst, nameLast, age); 
        res.status(200).json(response);
        saveDataStore();
      } catch(err) {    
        next(err);
      }
    });

    app.post('/v1/user/login', async (req: Request, res: Response, next: NextFunction) => {
      try {       
        const { email, password } = req.body;
        const response = users.userLogin(email, password);
        res.status(200).json(response.token);
        saveDataStore();
      } catch(err) {    
        next(err);
      }
    });

    app.post('/v1/user/logout', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.headers['authorization'].split(' ')[1];
        const response = users.userLogout(token);
        res.status(200).json(response);
        saveDataStore();
      } catch(err) {
        next(err);
      }
    });
    
    app.post('/v1/company/register', async (req: Request, res: Response, next: NextFunction) => {
      try {
        // const { companyName, companyAbn, adminEmail, adminPassword, contactNumber } = req.body;
        // const { companyName, companyAbn } = company
        // const { adminEmail, adminPassword } = admin 
        const {address, city, state, postcode, country} = req.body;
        const {token, companyName, companyAbn, companyEmail, contactNumber} = req.body;
        const headquarters: Location = validateLocation(address, city, state, postcode, country);
        const response = companies.registerCompany(token, companyName, companyAbn, headquarters, companyEmail, contactNumber);
        res.status(200).json(response);
        saveDataStore();
      } catch(err) {
        next(err);
      }
    });

    app.get('/v1/company/userAdd', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { companyId, userEmailToAdd } = req.body;
        const token = req.headers['authorization'].split(' ')[1];
        const response = companies.addCompanyUser(token, companyId, userEmailToAdd);
        res.status(200).json(response);
      } catch(err) {
        next(err);
      }
    });

    app.post('/v1/invoice', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const invoiceDetails = req.body;
        const token = req.headers['authorization'].split(' ')[1];
        const response = invoices.createInvoice(token, invoiceDetails); 
        res.status(200).json(response);
        saveDataStore();
      } catch(err) {
        next(err);
      }
    });
    
    app.get('/v1/invoice/:invoiceId', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const contentType = req.headers['content-type'].split(' ')[0];
        const invoiceId = parseInt(req.params.invoiceId);
        const token = req.headers['authorization'].split(' ')[1];
        const response = invoices.retrieveInvoice(token, invoiceId);
        if (contentType.includes('application/json')) {
          res.status(200).json(response);
        } else {
          const UBLresponse = Converter.parseToUBL(response);
          res.status(200).send(UBLresponse);
        } 
      } catch(err) {
        next(err);
      }
    });

    app.put('/v1/invoice/:invoiceId/edit/details', (req: Request, res: Response) => {
        // change whatever
        const { sender, receiver, issueDate, dueDate } = req.body;
        const response = invoices.editInvoiceDetails(sender, receiver, issueDate, dueDate);
      
        res.json("Not Implemented");
      });
      
    app.put('/v1/invoice/:invoiceId/edit/state', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { status } = req.body;
        const invoiceId = parseInt(req.params.invoiceId);
        const token = req.headers['authorization'].split(' ')[1];
        const response = invoices.editInvoiceState(token, invoiceId, status);
        res.status(200).json(response);
      } catch(err) {
        next(err);
      }
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
        const response = invoices.listCompanyInvoices(sender, receiver);
      
        res.json("Not Implemented");
    });

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      res.status(err.status || 500).json({ error: err.message });
    });

}


export default routes;
