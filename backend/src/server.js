"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
function createServer() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // Use middleware that allows for access from other domains
    app.use((0, cors_1.default)());
    // for logging errors (print to terminal)
    app.use((0, morgan_1.default)('dev'));
    // For establishing routes for this app
    (0, routes_1.default)(app);
    return app;
}
exports.default = createServer;
