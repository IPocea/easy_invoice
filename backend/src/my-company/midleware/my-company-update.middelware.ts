import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { checkEmptyInputs } from "../../utils/shared-middlewares";

@Injectable()
export class VerifyMyCompanyUpdate implements NestMiddleware {
	constructor() {}

	async use(req: Request, res: Response, next: NextFunction) {
		checkEmptyInputs(
			req.body.name,
			req.body.J,
			req.body.CUI,
			req.body.headquarters,
			req.body.county,
			req.body.vatRate
		);

		next();
	}
}
