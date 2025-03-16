import { default as server_1 } from './backend/src/server.js';
import yaml from 'yaml';
import swagger_ui_express from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';

import serverless from 'serverless-http';

const app = server_1.default();
const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
app.use('/docs', swagger_ui_express.serve, swagger_ui_express.setup(yaml.parse(file), { swaggerOptions: { docExpansion: false ? 'full' : 'list' } }));
app.get('/', swagger_ui_express.serve, swagger_ui_express.setup(yaml.parse(file)));

const serverlessHandler = serverless(app);  
export const handler = async (event, context) => {
  const result = await serverlessHandler(event, context);
  return result;
};
