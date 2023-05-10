import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
export declare class VerifyPaymentGet implements NestMiddleware {
    constructor();
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
