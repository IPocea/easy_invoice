import {
	BadRequestException,
	Injectable,
	NestMiddleware,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { checkEmptyInputs } from "../../utils/shared-middlewares";

@Injectable()
export class VerifyBuyerCreate implements NestMiddleware {
	constructor() {}

	async use(req: Request, res: Response, next: NextFunction) {
		checkEmptyInputs(req.body.name, req.body.invoiceId);

		if (!req.body.J && !req.body.series) {
			throw new BadRequestException(
				"Te rugam sa completezi toate campurile obligatorii"
			);
		}

		if (!req.body.CUI && !req.body.CNP) {
			throw new BadRequestException(
				"Te rugam sa completezi toate campurile obligatorii"
			);
		}

		next();
	}
}
