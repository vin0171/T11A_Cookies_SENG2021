import { Express, NextFunction, Request, Response } from "express";

import * as invoices from './invoices';
import * as companies from './companies';
import * as users from './users';
import { loadDataStore, saveDataStore, setData } from "./dataStore";

// import errorHandler from 'middleware-http-errors';

function routes(app: Express) {
    // Echo route

    app.post('/echo', (req: Request, res: Response) => {
        res.send('POST request to the homepage')
    })

    // TODO: Add more routes below 

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
        next(err)
      }
    });

    app.post('/v1/user/login', (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        const response = users.authLogin(email, password);
      
        res.json("Not Implemented");
    });

    app.post('/v1/user/logout', (req: Request, res: Response) => {
      const { token } = req.body;
      const response = users.authLogout(token);
    
      res.json("Not Implemented");
    });
    
    app.post('/v1/company/register', (req: Request, res: Response) => {
      const { companyName, companyAbn, adminEmail, adminPassword, contactNumber } = req.body;
      const response = companies.registerCompany(companyName, companyAbn, adminEmail, adminPassword, contactNumber);
    
      res.json("Not Implemented");
    });

    app.get('/v1/company/userAdd', (req: Request, res: Response) => {
      const { companyId, token, userEmail } = req.body;
      res.json("Not Implemented");
    });

    app.post('/v1/invoice', (req: Request, res: Response) => {
      // change whatever
      // I literally do not want to pass in 50 billion parameters so its easier this way 
      // and also like make sure they dont put random sht thanks
      const invoiceDetails = req.body;
      // invoice details also has a time called 'companyId' to add the invoice to 
      const response = invoices.createInvoice(invoiceDetails);
    
      res.json("Not Implemented");
    });
    

    app.get('/v1/invoice/:invoiceId', (req: Request, res: Response) => {
      // change whatever
      // token from autehtaciton header 
      // const token = 1;
      // const response = invoices.getInvoice(token, invoiceId);
    
      res.json("Not Implemented");
    });

    app.put('/v1/invoice/:invoiceId/edit/details', (req: Request, res: Response) => {
        // change whatever
        const { sender, receiver, issueDate, dueDate } = req.body;
        const response = invoices.editInvoiceDetails(sender, receiver, issueDate, dueDate);
      
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
        const response = invoices.listCompanyInvoices(sender, receiver);
      
        res.json("Not Implemented");
    });

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      res.status(err.status || 500).json({ error: err.message });
    });

}


export default routes;
