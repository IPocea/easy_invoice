import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { IndividualService } from "../individual.service";
export declare class VerifyIndividualCreate implements NestMiddleware {
    private readonly individualService;
    constructor(individualService: IndividualService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
