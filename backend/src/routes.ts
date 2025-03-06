import { Express, Request, Response } from "express";
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';
import config from './config.json';
// import errorHandler from 'middleware-http-errors';

function routes(app: Express) {
    // Echo route
    app.post('/echo', (req: Request, res: Response) => {
        res.send('POST request to the homepage')
    })
    // TODO: Add more routes below 
}


export default routes;