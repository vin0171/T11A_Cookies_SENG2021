import { Express, NextFunction, Request, Response } from "express";
import * as users from './users';
import * as companies from './companies';
import * as invoices from './invoices';
import * as customers from './customers';
import * as items from './items';
import { validateLocation, validateToken } from "./validationHelpers";
import { Invoice, Location } from "./interface";
// import { InvoiceConverter } from "./InvoiceConverter";
import HTTPError from 'http-errors';
import { resetDataStore } from "./dataStore";
import { InvoiceConverter } from "./InvoiceConverter";
import { getCompany, getInvoice } from "./interfaceHelpers";
import { validateUBL } from "./validation";
import { readInvoices } from "./InvoiceReader";
import { SyntaxKind } from "typescript";

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

  app.get('/v1/user/invoices', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers['authorization']?.split(' ')[1] || undefined;
      const response = await invoices.listUserInvoices(token);
      res.status(200).json(response);
    } catch(err) {
      next(err)
    }
  });

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
      const response = await companies.addCompanyUserV3(token, companyId, userEmailToAdd);
      res.status(200).json(response);
    } catch(err) {
      next(err);
    }
  });

  app.get('/v1/company/:companyId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = req.params.companyId;
      const response = await getCompany(companyId)
      res.status(200).json(response);
    } catch(err) {
      next(err)
    }
  });

  app.get('/v1/company/:companyId/invoices', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers['authorization'].split(' ')[1];
      const companyId = req.params.companyId;
      const response = await invoices.listCompanyInvoices(token, companyId);
      res.status(200).json(response);
    } catch(err) {
      next(err)
    }
  });

  app.post('/v1/invoice', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {invoiceDetails} = req.body;
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
        const company = await getCompany(response.companyId);
        const invoiceUBL = new InvoiceConverter(response).parseToUBL(company.companyId);
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

  app.post('/v1/invoice/validate', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ublInvoice } = req.body;
      const response = validateUBL(ublInvoice);
      res.status(200).json(response);
    } catch(err) {
      next(err);
    }
  });
  

  app.delete('/v1/invoice/:invoiceId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers['authorization']?.split(' ')[1] || undefined;
      const invoiceId  = req.params.invoiceId;
      const response = await invoices.deleteInvoice(token, invoiceId);
      res.status(200).json(response);
    } catch(err) {
      next(err)
    }
  });

// ========================================================================= //
// Iteration 2
// ========================================================================= //

  app.post('/v1/invoice/:invoiceId/pdf', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers['authorization']?.split(' ')[1] || undefined;
      const invoiceId = req.params.invoiceId;
      console.log('hello??')
      // Generate the PDF for the invoice
      const pdfBuffer = await invoices.generateInvoicePDF(token, invoiceId);
  
      // Set headers for PDF response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoiceId}.pdf`);
      console.log('PDF generated successfully😅');
      res.status(200).send(pdfBuffer);
    } catch (err) {
      next(err);
    }
  });

  app.post('/v2/invoice', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { invoiceId, invoiceDetails, isDraft } = req.body;
      const token = req.headers['authorization']?.split(' ')[1] || undefined;
      const response = await invoices.createInvoiceV2(token, invoiceId, invoiceDetails, isDraft); 
      res.status(200).json(response);
    } catch(err) {
      next(err);
    }
  });

  app.get('/v1/user/details', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers['authorization']?.split(' ')[1] || undefined;
      const response = await validateToken(token)
      res.status(200).json(response);
    } catch(err) {
      next(err)
    }
  });

  app.post('/v1/invoice/read', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ublInvoice } = req.body;
  
      if (!ublInvoice || typeof ublInvoice !== 'string') {
        throw new HTTPError.BadRequest('UBL invoice must be a valid XML string.');
      }
  
      const parsedInvoice = readInvoices(ublInvoice);
      res.status(200).json(parsedInvoice);
    } catch (err) {
      next(err);
    }
  });
// ========================================================================= //
// Iteration 3
// ========================================================================= //

  app.post('/v3/user/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, nameFirst, nameLast } = req.body;
      const response = await users.registerUserV3(email, password, nameFirst, nameLast); 
      res.status(200).json(response);
    } catch(err) {    
      next(err);
    }
  });

  app.post('/v3/user/login', async (req: Request, res: Response, next: NextFunction) => {
    try {       
      const { email, password } = req.body;
      const response = await users.userLoginV3(email, password);
      res.status(200).json(response);
    } catch(err) {    
      next(err);
    }
  });

  app.post('/v3/company/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers['authorization']?.split(' ')[1] || undefined;
      const {companyName, companyAbn, companyEmail, contactNumber} = req.body;
      const {address, city, state, postcode, country} = req.body;
      const headquarters: Location = validateLocation(address, city, state, postcode, country);
      const response = await companies.registerCompanyV3(token, companyName, companyAbn, headquarters, companyEmail, contactNumber);
      res.status(200).json(response);
    } catch(err) {
      next(err);
    }
  });

  app.post('/v3/company/userAdd', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { companyId, userEmailToAdd } = req.body;
      const token = req.headers['authorization']?.split(' ')[1] || undefined;
      const response = await companies.addCompanyUserV3(token, companyId, userEmailToAdd);
      res.status(200).json(response);
    } catch(err) {
      next(err);
    }
  });

  app.get('/v3/company/:companyId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = req.params.companyId;
      const response = await getCompany(companyId)
      res.status(200).json(response);
    } catch(err) {
      next(err)
    }
  });

  app.get('/v3/user/details', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers['authorization']?.split(' ')[1] || undefined;
      const response = await validateToken(token)
      res.status(200).json(response);
    } catch(err) {
      next(err)
    }
  });

  app.get('/v3/company/:companyId/invoices', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers['authorization'].split(' ')[1];
      const companyId = req.params.companyId;
      const response = await invoices.listCompanyInvoices(token, companyId);
      res.status(200).json(response);
    } catch(err) {
      next(err)
    }
  });

  //// Invoices 
  app.post('/v3/invoice', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {invoiceDetails, isDraft} = req.body;
      const token = req.headers['authorization']?.split(' ')[1] || undefined;
      const response = await invoices.createInvoiceV3(token, invoiceDetails, isDraft); 
      res.status(200).json(response);
    } catch(err) {
      next(err);
    }
  });
  

  app.get('/v3/invoice/:invoiceId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contentType = req.headers['accept'].split(' ')[0] || "application/JSON";
      const invoiceId = req.params.invoiceId;
      const token = req.headers['authorization']?.split(' ')[1] || undefined;
      const response = await invoices.retrieveInvoice(token, invoiceId);
      if (contentType.includes('application/xml'))  {
        const company = await getCompany(response.companyId);
        const invoiceUBL = new InvoiceConverter(response).parseToUBL(company.companyId);
        res.status(200).send(invoiceUBL);
        return;
      } 
      res.status(200).json(response);
    } catch(err) {
      next(err);
    }
  });

  
  app.put('/v3/invoice/:invoiceId/edit', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers['authorization']?.split(' ')[1] || undefined;
      const { invoiceId, edits } = req.body;
      const response = await invoices.editInvoiceDetailsV3(token, invoiceId, edits);
      res.status(200).json(response);
    } catch(err) {
      next(err);
    }
  });

  app.post('/v3/invoice/validate', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ublInvoice } = req.body;
      const response = validateUBL(ublInvoice);
      res.status(200).json(response);
    } catch(err) {
      next(err);
    }
  });
  

  app.delete('/v3/invoice/:invoiceId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers['authorization']?.split(' ')[1] || undefined;
      const invoiceId  = req.params.invoiceId;
      const response = await invoices.deleteInvoice(token, invoiceId);
      res.status(200).json(response);
    } catch(err) {
      next(err)
    }
  });


  app.post('/v3/customer', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers['authorization']?.split(' ')[1] || undefined;
      const { name, billingAddress, shippingAddress, email, bankName, bankAccount, companyId } = req.body;
      const response = await customers.registerCustomer(token, name, companyId, billingAddress, shippingAddress, email, bankName, bankAccount);
      res.status(200).json(response);
    } catch(err) {
      next(err);
    }
  });

  app.post('/v3/item', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers['authorization']?.split(' ')[1] || undefined;
      const {name, sku, price, description, companyId} = req.body;
      const response = await items.registerItem(token, companyId, name, sku, price, description);
      res.status(200).json(response); 
    } catch(err) {
      next(err);
    }
  });

  app.get('/v3/company/:companyId/customers', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers['authorization'].split(' ')[1];
      const companyId = req.params.companyId;
      const response = await customers.listCompanyCustomers(token, companyId);
      res.status(200).json(response);
    } catch(err) {
      next(err)
    }
  });

  app.get('/v3/company/:companyId/items', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers['authorization'].split(' ')[1];
      const companyId = req.params.companyId;
      const response = await items.listCompanyItems(token, companyId);
      res.status(200).json(response);
    } catch(err) {
      next(err)
    }
  });

  // We indirectly use next but not directly which causes linting errors
  // eslint-disable-next-line 
  app.use((err: HTTPError.HttpError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({ error: err.message });
  });
}

export default routes;
