import express, { Express, Router } from "express";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import path from "path";
import { IAuthToken } from "./auth";
import { errorMiddleware } from "./error"
import router from "./routes";

declare module "express-serve-static-core" {
    interface Request {
        token: IAuthToken;
    }
}

export class Server {
    public app: Express;

    constructor() {
        this.app = express();
        this.configure();
    }

    private configure() {
        this.configureMiddleware();
        this.configureCors();
        this.configureRoutes();
        this.configureErrorMiddleware();
        this.configureDB();
    }

    private configureDB() {
        /// Check DB connection & configure admin and stuff
    }

    private configureErrorMiddleware() {
        this.app.use(errorMiddleware);
    }

    private configureCors() {
        router.use(cors());
    }

    private configureRoutes() {
        let basePath = "/api";
        this.app.use(basePath, router);
        if (process.env.NODE_ENV == "production") {
            this.app.use(express.static(path.join(__dirname, "/../dist")));
        }
    }

    private configureMiddleware() {
        this.app.use(json({ limit: "50mb" }));
        this.app.use(urlencoded({ limit: "50mb", extended: true }));
    }

    public start() {
        const port = process.env.PORT || 3000;
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}
