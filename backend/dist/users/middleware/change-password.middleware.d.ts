import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
export declare class changePasswordMiddleware implements NestMiddleware {
    constructor();
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
