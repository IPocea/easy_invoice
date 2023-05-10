import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { VerifyHelper } from "./verifyHelper";
export declare class VerifySignup implements NestMiddleware {
    private readonly verifyHelper;
    constructor(verifyHelper: VerifyHelper);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
