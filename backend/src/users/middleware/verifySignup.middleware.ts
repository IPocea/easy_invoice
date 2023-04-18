import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { VerifyHelper } from "./verifyHelper";
import {
	checkEmptyInputs,
	checkRole,
	checkPasswordPattern,
	checkEmailPattern,
} from "../../utils/shared-middlewares";

@Injectable()
export class VerifySignup implements NestMiddleware {
	constructor(private readonly verifyHelper: VerifyHelper) {}

	async use(req: Request, res: Response, next: NextFunction) {
		checkEmptyInputs(
			req.body.username,
			req.body.password,
			req.body.email,
			req.body.firstName,
			req.body.lastName
		);
		if (!req.body.role) {
			req.body.role = checkRole(req.body.role);
		}
		checkPasswordPattern(req.body.password);
		checkEmailPattern(req.body.email);
		await this.verifyHelper.checkDuplicateEmail(req.body.email);
		await this.verifyHelper.checkDuplicateUser(req.body.username);

		next();
	}
}
