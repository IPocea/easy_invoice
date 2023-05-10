import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { VerifyHelper } from "./verifyHelper";
import { UsersService } from "../users.service";
export declare class VerifyModify implements NestMiddleware {
    private readonly verifyHelper;
    private usersServices;
    constructor(verifyHelper: VerifyHelper, usersServices: UsersService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
