import express from "express";
import morgan from 'morgan';
import cors from 'cors';
import routes from "./routes";

function createServer() {
    const app = express();
    app.use(express.json());
    // Use middleware that allows for access from other domains
    app.use(cors());
    // for logging errors (print to terminal)
    app.use(morgan('dev'));
    // For establishing routes for this app
    routes(app)

    return app
}

export default createServer