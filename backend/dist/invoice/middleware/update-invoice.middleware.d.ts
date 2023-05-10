import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { InvoiceService } from "../invoice.service";
export declare class VerifyInvoiceUpdate implements NestMiddleware {
    private readonly invoiceService;
    private ObjectId;
    constructor(invoiceService: InvoiceService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
