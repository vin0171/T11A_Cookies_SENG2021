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
import { checkTablesSetup } from './dataStore';

// Set up web app
const app = createServer()

const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));
app.get('/', sui.serve, sui.setup(YAML.parse(file)));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// Set the server to listen on a port
app.listen(PORT, HOST, async () => {
    await checkTablesSetup();
    console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
    const url = `http://localhost:${PORT}/docs`;
    console.log(`Example app listening at ${url}`);
    console.log('Control+C to quit the app')
});
