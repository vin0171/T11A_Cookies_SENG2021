import request from 'supertest';
import { Express } from 'express';

export enum HTTPMethod {
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    GET = 'GET'
}

export enum FORMAT {
    UBL = 'ubl',
    JSON = 'json'
}

// Literally same as COMP1531 but instead you are passing through the app/server
// basically specifiying which server you want to run the command on
const requestHelper = async (
    app: Express,
    method: HTTPMethod,
    path: string,
    requestBody: object,
    format: FORMAT
  ) => {
    let response;
    switch (method) {
      case HTTPMethod.POST:
        response = await request(app).post(path).send(requestBody).set('Accept', 'application/' + format);
        break;
      case HTTPMethod.PUT:
        response = await request(app).put(path).send(requestBody).set('Accept', 'application/' + format);
        break;
      case HTTPMethod.DELETE:
        response = await request(app).delete(path).send(requestBody).set('Accept', 'application/' + format);
        break;
      case HTTPMethod.GET:
        response = await request(app).get(path).send(requestBody).set('Accept', 'application/' + format);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  
    return response
};

export const requestClear = async (app: Express) => {
  return await requestHelper(app, HTTPMethod.DELETE, '/v1/clear', {}, FORMAT.JSON);
};

export const requestUserRegister = async (app: Express, email: string, password: string, nameFirst: string, nameLast: string) => {
  return await requestHelper(app, HTTPMethod.POST, '/v1/user/register', { email, password, nameFirst, nameLast }, FORMAT.JSON);
};

export const requestAuthLogin = async (app: Express, email: string, password: string) => {
  return await requestHelper(app, HTTPMethod.POST, '/v1/auth/login', { email, password }, FORMAT.JSON);
};
  
export const requestAuthLogout = async (app: Express, token: string) => {
  return await requestHelper(app, HTTPMethod.POST, '/v1/auth/logout', { token }, FORMAT.JSON);
};
  


  