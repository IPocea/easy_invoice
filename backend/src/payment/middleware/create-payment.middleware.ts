import {
	Injectable,
	NestMiddleware,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import {
	checkEmptyInputs,
	checkIdValidity,
} from "../../utils/shared-middlewares";

@Injectable()
export class VerifyPaymentCreate implements NestMiddleware {
	constructor() {}

	async use(req: Request, res: Response, next: NextFunction) {
		checkEmptyInputs(
			req.body.paymentAmount,
			req.body.invoiceId,
			req.body.addedBy
		);

		checkIdValidity(req.body.invoiceId);

		next();
	}
}
