import { Request, Response, NextFunction } from "express";
import { BaseError } from "../BaseError";

export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof BaseError) {
        const be = error as BaseError;
        return res.status(be.status).json({ message: be.message });
    }

    return res.status(500).json({ message: "Internal server error:" + error.message });
}