"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ====================================================================
//  THIS IS FOR ONLY STARTING THE SERVER LOCALLY
// ====================================================================
const config_json_1 = __importDefault(require("./config.json"));
// import errorHandler from 'middleware-http-errors';
const server_1 = __importDefault(require("./server"));
const yaml_1 = __importDefault(require("yaml"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const serverless_http_1 = __importDefault(require("serverless-http"));
// Set up web app
const app = (0, server_1.default)();
const file = fs_1.default.readFileSync(path_1.default.join(process_1.default.cwd(), 'swagger.yaml'), 'utf8');
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(yaml_1.default.parse(file), { swaggerOptions: { docExpansion: config_json_1.default.expandDocs ? 'full' : 'list' } }));
app.get('/', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(yaml_1.default.parse(file)));
const PORT = parseInt(process_1.default.env.PORT || config_json_1.default.port);
const HOST = process_1.default.env.IP || 'localhost';
// Set the server to listen on a port
const serverHandlers = (0, serverless_http_1.default)(app);
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield serverHandlers(event, context);
    return result;
});
exports.handler = handler;
