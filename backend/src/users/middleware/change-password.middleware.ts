import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import {
	checkEmptyInputs,
	checkPasswordPattern,
} from "../../utils/shared-middlewares";

@Injectable()
export class changePasswordMiddleware implements NestMiddleware {
	constructor() {}

	async use(req: Request, res: Response, next: NextFunction) {
		checkEmptyInputs(req.body.password);
		checkPasswordPattern(req.body.password);

		next();
	}
}
