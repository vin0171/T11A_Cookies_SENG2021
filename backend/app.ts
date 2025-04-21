// ====================================================================
//  THIS IS FOR ONLY STARTING THE SERVER LOCALLY
// ====================================================================
import config from './config.json';
// import errorHandler from 'middleware-http-errors';
import createServer from './server';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';
import serverless from 'serverless-http';

// Set up web app
const app = createServer()

const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));
app.get('/', sui.serve, sui.setup(YAML.parse(file)));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// Set the server to listen on a port
const serverHandlers = serverless(app);
const handler = async (event: any, context: any) => {
    const result = await serverHandlers(event, context);
    return result;
};
exports.handler = handler;