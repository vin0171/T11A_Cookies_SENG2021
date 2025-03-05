import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from './config.json';
// import errorHandler from 'middleware-http-errors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(express.json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));

const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
app.get('/', sui.serve, sui.setup(YAML.parse(file)));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';
// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

app.post('/data', (req: Request, res: Response): void => {
  const receivedData = req.body;
  res.json({ message: 'Data received', data: receivedData });
});

// Set the server to listen on a port
app.listen(PORT, HOST, () => {
    console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
    const url = `http://localhost:${PORT}/docs`;
    console.log(`Example app listening at ${url}`);
    console.log('Control+C to quit the app')
});
  
// The thing below causes memeory leaks for me lol
// // For coverage, handle Ctrl+C gracefully 
// process.on('SIGINT', () => {
//   server.close(() => console.log('Shutting down server gracefully.'));
// });
