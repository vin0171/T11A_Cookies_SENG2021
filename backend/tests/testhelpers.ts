import request from 'supertest';
import { Express } from 'express';
import { companyRequestBody } from '../interface';

export enum HTTPMethod {
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    GET = 'GET'
}

export enum Format {
    UBL = 'xml',
    JSON = 'json'
}

// Literally same as COMP1531 but instead you are passing through the app/server
// basically specifiying which server you want to run the command on
// Format: the format that the user will receive 
const requestHelper = async (
  app: Express,
  method: HTTPMethod,
  path: string,
  requestBody: object = {},
  token?: string,
  format: Format = Format.JSON
) => {
  let req;

  switch (method) {
    case HTTPMethod.POST:
      req = request(app).post(path);
      break;
    case HTTPMethod.PUT:
      req = request(app).put(path);
      break;
    case HTTPMethod.DELETE:
      req = request(app).delete(path);
      break;
    case HTTPMethod.GET:
      req = request(app).get(path);
      break;
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
  
  // What format we can expecting back from the client UBL2.0XML or JSON
  req.set("Accept", `application/${format}`);

  if (token !== undefined) {
    req.set('authorization', `Bearer ${token}`);
  }

  // Only send a request body for methods that support it
  if (method !== HTTPMethod.GET && method !== HTTPMethod.DELETE) {
    req.send(requestBody);
  }

  return await req;
};

export const requestClear = async (app: Express) => {
  return await requestHelper(app, HTTPMethod.DELETE, '/v1/clear', {});
};

export const requestUserRegister = async (app: Express, email: string, password: string, nameFirst: string, nameLast: string) => {
  return await requestHelper(app, HTTPMethod.POST, '/v1/user/register', { email, password, nameFirst, nameLast });
};

export const requestUserLogin = async (app: Express, email: string, password: string) => {
  return await requestHelper(app, HTTPMethod.POST, '/v1/user/login', { email, password });
};
  
export const requestUserLogout = async (app: Express, token: string) => {
  return await requestHelper(app, HTTPMethod.POST, '/v1/user/logout', { }, token);
};

export const requestCompanyRegister = async (app: Express, token: string, companyData: companyRequestBody ) => {
  return await requestHelper(app, HTTPMethod.POST, '/v1/company/register', companyData, token);
}
  
export const requestCompanyAddUser = async (app: Express, token: string, companyId: string, userEmailToAdd: string) => {
  return await requestHelper(app, HTTPMethod.POST, '/v1/company/userAdd', { companyId, userEmailToAdd }, token);
};

export const requestCreateInvoice = async (app: Express, token: string, invoiceDetails: object) => {
  return await requestHelper(app, HTTPMethod.POST, '/v1/invoice', invoiceDetails , token);
}

export const requestGetInvoice = async (app: Express, token: string, invoiceId: string, format: Format) => {
  return await requestHelper(app, HTTPMethod.GET, `/v1/invoice/${invoiceId}`, {}, token, format)
}

export const requestListCompanyInvoice = async (app: Express, token: string, companyId: string) => {
  return await requestHelper(app, HTTPMethod.GET, `/v1/company/${companyId}/invoices`,  {}, token);
}

export const requestDeleteInvoice = async (app: Express, token: string, invoiceId: string) => {
  return await requestHelper(app, HTTPMethod.DELETE, `/v1/invoice/${invoiceId}`, {}, token);
}

export const requestEditInvoice = async (app: Express, token: string, invoiceId: string, edits: { notes?: string; total?: number; customerName?: string; }) => {
  return await requestHelper(app, HTTPMethod.PUT, `/v1/invoice/${invoiceId}/edit`, { invoiceId, edits }, token);
}
  
