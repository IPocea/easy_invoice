import {
	Injectable,
	NestMiddleware,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { checkEmptyInputs } from "../../utils/shared-middlewares";

@Injectable()
export class VerifyContractCreate implements NestMiddleware {
	constructor(
	) {}

	async use(req: Request, res: Response, next: NextFunction) {
		checkEmptyInputs(
			req.body.number,
			req.body.subjectOfContract,
		);
		next();
	}
}
