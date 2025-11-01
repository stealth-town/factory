import { NextFunction, Request, Response, RequestHandler } from "express"

export const reqWrapper = (handler: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}