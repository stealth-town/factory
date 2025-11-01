import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../error";
import * as jwt from "jsonwebtoken";
import config from "../config";

export interface IAuthToken {
    userId: string; // wallet
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) {
            throw new UnauthorizedError("No authorization header provided");
        }

        const splitted = auth.split(" ");
        if (splitted.length !== 2) {
            throw new UnauthorizedError("Invalid token.");
        }

        const decoded = jwt.verify(splitted[1], config.jwtSecret);
        if (!decoded) {
            throw new UnauthorizedError("Invalid token.");
        }

        const token: IAuthToken = decoded as IAuthToken;
        if (!token) {
            throw new UnauthorizedError("Invalid token.");
        }

        req.token = token;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new UnauthorizedError("Invalid token."));
            return;
        }

        next(error);
    }
};

export const generateToken = (tokenData: IAuthToken): string => {
    return jwt.sign(tokenData, config.jwtSecret, {
        expiresIn: "1d", // can be configurable if we needed
    });
};