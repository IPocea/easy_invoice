import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { MyCompanyService } from "../my-company.service";
export declare class VerifyMyCompany implements NestMiddleware {
    private readonly myCompanyService;
    constructor(myCompanyService: MyCompanyService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
