import { Express, NextFunction, Request, Response } from "express";
import * as invoices from './invoices';
import * as companies from './companies';
import * as users from './users';
import { saveDataStore, setData } from "./dataStore";
import { validateLocation } from "./validationHelpers";
import { Invoice, Location } from "./interface";
import { token } from "morgan";
import { InvoiceConverter } from "./InvoiceConverter";
// import errorHandler from 'middleware-http-errors';

function routes(app: Express) {
    app.post('/echo', (res: Response) => {
        res.send('POST request to the homepage')
    })
// ========================================================================= //
// Iteration 1 
// ========================================================================= //

    app.delete('/v1/clear', async (req: Request, res: Response, next: NextFunction) => {
      setData({
        companies: [],
        users: [],
        invoices: []});
      res.status(200).json({})
    })
    
    app.post('/v1/user/register', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password, nameFirst, nameLast, age } = req.body;
        const response = users.registerUser(email, password, nameFirst, nameLast, age); 
        res.status(200).json({token: response});
        saveDataStore();
      } catch(err) {    
        next(err);
      }
    });

    app.post('/v1/user/login', async (req: Request, res: Response, next: NextFunction) => {
      try {       
        const { email, password } = req.body;
        const token = users.userLogin(email, password);
        res.status(200).json({token: token});
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
        const token = req.headers['authorization'].split(' ')[1];
        const {companyName, companyAbn, companyEmail, contactNumber} = req.body;
        const {address, city, state, postcode, country} = req.body;
        const headquarters: Location = validateLocation(address, city, state, postcode, country);
        const companyId = companies.registerCompany(token, companyName, companyAbn, headquarters, companyEmail, contactNumber);
        res.status(200).json({companyId: companyId});
        saveDataStore();
      } catch(err) {
        next(err);
      }
    });

    app.post('/v1/company/userAdd', async (req: Request, res: Response, next: NextFunction) => {
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
        const invoiceId = req.params.invoiceId;
        const token = req.headers['authorization'].split(' ')[1];
        const response: Invoice = invoices.retrieveInvoice(token, invoiceId, contentType);
        if (contentType.includes('application/xml'))  {
          const invoiceUBL = new InvoiceConverter(response).parseToUBL();
          res.status(200).send(invoiceUBL);
          return;
        } 
        res.status(200).json(response);
      } catch(err) {
        next(err);
      }
    });

    app.put('/v1/invoice/:invoiceId/edit', (req: Request, res: Response, next: NextFunction) => {
        try {
          const token = req.headers['authorization'].split(' ')[1];
          const { invoiceId, edits } = req.body;
          const response = invoices.editInvoiceDetails(token, invoiceId, edits);
          res.status(200).json(response);
        } catch(err) {
          next(err)
        }
      });
      
    app.delete('/v1/invoice/:invoiceId', (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.headers['authorization'].split(' ')[1];
        const invoiceId  = req.params.invoiceId;
        const response = invoices.deleteInvoice(token, invoiceId);
        res.status(200).json(response);
      } catch(err) {
        next(err)
      }
    });
      
      
    app.get('/v1/invoice/list', (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.headers['authorization'].split(' ')[1];
        const companyId = req.params.companyId;
        const response = invoices.listCompanyInvoices(token, companyId);
        res.status(200).json(response);
      } catch(err) {
        next(err)
      }
    });

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      res.status(err.status || 500).json({ error: err.message });
    });

}


export default routes;
