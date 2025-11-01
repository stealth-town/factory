import { BaseError } from "./BaseError";

export class ServerError extends BaseError {
    constructor(message: string) {
        super(500, message);
    }
}