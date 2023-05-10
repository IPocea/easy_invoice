import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ContractModelService } from "../contract-model.service";
export declare class VerifyContractModelCreate implements NestMiddleware {
    private contractModelService;
    constructor(contractModelService: ContractModelService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
