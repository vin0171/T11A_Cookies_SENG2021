import request from 'supertest';
import { Express } from 'express';
import { companyRequestBody, TokenObject } from '../interface';

export enum HTTPMethod {
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    GET = 'GET'
}

export enum Format {
    UBL = 'ubl',
    JSON = 'json'
}

// Literally same as COMP1531 but instead you are passing through the app/server
// basically specifiying which server you want to run the command on
const requestHelper = async (
  app: Express,
  method: HTTPMethod,
  path: string,
  requestBody: object = {},
  token?: TokenObject,
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

  req.set("Accept", `application/${format}`);

  if (token?.token) {
    req.set("Authorization", `Bearer ${token.token}`);
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

export const requestAuthLogin = async (app: Express, email: string, password: string) => {
  return await requestHelper(app, HTTPMethod.POST, '/v1/auth/login', { email, password });
};
  
export const requestAuthLogout = async (app: Express, token: string) => {
  return await requestHelper(app, HTTPMethod.POST, '/v1/auth/logout', { }, { token });
};
 
export const requestCompanyRegister = async (app: Express, companyData: companyRequestBody ) => {
  return await requestHelper(app, HTTPMethod.POST, '/v1/company/register', companyData);
}
  
export const requestCompanyAddUser = async (app: Express, token: string, companyId: number, userEmailToAdd: string) => {
  return await requestHelper(app, HTTPMethod.PUT, '/v1/company/userAdd', { companyId, userEmailToAdd }, { token });
};

export const requestCreateInvoice = async (app: Express, token: string, invoiceDetails: object) => {
  return await requestHelper(app, HTTPMethod.POST, '/v1/invoice', invoiceDetails , { token });
}

export const requestGetInvoice = async (app: Express, token: string, invoiceId: number, format: Format) => {
  return await requestHelper(app, HTTPMethod.GET, '/v1/invoice/:invoiceId', { invoiceId }, { token }, format)
}

export const requestListCompanyInvoice = async (app: Express, token: string, companyId: number) => {
  return await requestHelper(app, HTTPMethod.GET, '/v1/invoice/list', { companyId }, { token })
}
  
  