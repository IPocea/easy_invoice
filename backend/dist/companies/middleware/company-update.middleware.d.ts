import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { CompanyService } from "../company.service";
export declare class VerifyCompanyUpdate implements NestMiddleware {
    private readonly companyService;
    constructor(companyService: CompanyService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
