import { Express, Request, Response } from "express";
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';
import config from './config.json';
import * as invoices from './invoices';
import * as companies from './companies';
import * as users from './users';
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
      const response = invoices.createInvoice(sender, receiver, issueDate, dueDate);
    
      res.json("Not Implemented");
    });
    

    app.get('/v1/invoice/:invoiceId', (req: Request, res: Response) => {
      // change whatever
      const { sender, receiver, issueDate, dueDate } = req.body;
      const response = invoices.getInvoice(sender, receiver, issueDate, dueDate);
    
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

}


export default routes;
