import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import {
	checkEmptyInputs,
	checkIdValidity,
} from "../../utils/shared-middlewares";

@Injectable()
export class VerifyInvoiceToggleStatus implements NestMiddleware {
	constructor() {}

	async use(req: Request, res: Response, next: NextFunction) {
		checkIdValidity(req.params.invoiceId);
		checkEmptyInputs(req.body.editedBy);

		next();
	}
}
