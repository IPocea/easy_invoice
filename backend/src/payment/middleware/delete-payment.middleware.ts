import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { checkIdValidity } from "../../utils/shared-middlewares";

@Injectable()
export class VerifyPaymentDelete implements NestMiddleware {
	constructor() {}

	async use(req: Request, res: Response, next: NextFunction) {
		checkIdValidity(req.params.paymentId, req.params.invoiceId);

		next();
	}
}
