import { Express, NextFunction, Request, Response } from "express";
import * as users from './users';
import * as companies from './companies';
import * as invoices from './invoices';
import { validateLocation } from "./validationHelpers";
import { Invoice, Location } from "./interface";
// import { InvoiceConverter } from "./InvoiceConverter";
import HTTPError from 'http-errors';
import { resetDataStore } from "./dataStore";
import { InvoiceConverter } from "./InvoiceConverter";

function routes(app: Express) {
// ========================================================================= //
// Iteration 1 
// ========================================================================= //

  app.delete('/v1/clear', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await resetDataStore();
      res.status(200).json({});
    } catch(err) {
      next(err);
    }
  });

  app.post('/v1/user/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, nameFirst, nameLast, age } = req.body;
      const response = await users.registerUser(email, password, nameFirst, nameLast, age); 
      res.status(200).json(response);
    } catch(err) {    
      next(err);
    }
  });

  app.post('/v1/user/login', async (req: Request, res: Response, next: NextFunction) => {
    try {       
      const { email, password } = req.body;
      const response = await users.userLogin(email, password);
      res.status(200).json(response);
    } catch(err) {    
      next(err);
    }
  });

  // app.post('/v1/user/logout', async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const token = req.headers['authorization'].split(' ')[1];
  //     const response = users.userLogout(token);
  //     res.status(200).json(response);
  //   } catch(err) {
  //     next(err);
  //   }
  // });

  // app.get('/v1/user/invoices', async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const token = req.headers['authorization'].split(' ')[1];
  //     const response = invoices.listUserInvoices(token);
  //     res.status(200).json(response);
  //   } catch(err) {
  //     next(err)
  //   }
  // });

  app.post('/v1/company/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers['authorization']?.split(' ')[1] || undefined;
      const {companyName, companyAbn, companyEmail, contactNumber} = req.body;
      const {address, city, state, postcode, country} = req.body;
      const headquarters: Location = validateLocation(address, city, state, postcode, country);
      const response = await companies.registerCompany(token, companyName, companyAbn, headquarters, companyEmail, contactNumber);
      res.status(200).json(response);
    } catch(err) {
      next(err);
    }
  });

  app.post('/v1/company/userAdd', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { companyId, userEmailToAdd } = req.body;
      const token = req.headers['authorization']?.split(' ')[1] || undefined;
      const response = await companies.addCompanyUser(token, companyId, userEmailToAdd);
      res.status(200).json(response);
    } catch(err) {
      next(err);
    }
  });

  // app.get('/v1/company/:companyId/invoices', async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const token = req.headers['authorization'].split(' ')[1];
  //     const companyId = req.params.companyId;
  //     const response = await invoices.listCompanyInvoices(token, companyId);
  //     res.status(200).json(response);
  //   } catch(err) {
  //     next(err)
  //   }
  // });

  app.post('/v1/invoice', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invoiceDetails = req.body;
      const token = req.headers['authorization']?.split(' ')[1] || undefined;
      const response = await invoices.createInvoice(token, invoiceDetails); 
      res.status(200).json(response);
    } catch(err) {
      next(err);
    }
  });
  
  app.get('/v1/invoice/:invoiceId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contentType = req.headers['accept'].split(' ')[0] || "application/JSON";
      const invoiceId = req.params.invoiceId;
      const token = req.headers['authorization']?.split(' ')[1] || undefined;
      const response = await invoices.retrieveInvoice(token, invoiceId);
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

  app.put('/v1/invoice/:invoiceId/edit', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.headers['authorization']?.split(' ')[1] || undefined;
        const { invoiceId, edits } = req.body;
        const response = await invoices.editInvoiceDetails(token, invoiceId, edits);
        res.status(200).json(response);
      } catch(err) {
        next(err);
      }
    });
    
  // app.delete('/v1/invoice/:invoiceId', async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const token = req.headers['authorization']?.split(' ')[1] || undefined;
  //     const invoiceId  = req.params.invoiceId;
  //     const response = await invoices.deleteInvoice(token, invoiceId);
  //     res.status(200).json(response);
  //   } catch(err) {
  //     next(err)
  //   }
  // });

  // We indirectly use next but not directly which causes linting errors
  // eslint-disable-next-line 
  app.use((err: HTTPError.HttpError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({ error: err.message });
  });
}

export default routes;
