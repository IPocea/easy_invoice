import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { VerifyHelper } from "./verifyHelper";
import { UsersService } from "../users.service";
import { checkRole, checkEmailPattern } from "../../utils/shared-middlewares";

@Injectable()
export class VerifyModify implements NestMiddleware {
	constructor(
		private readonly verifyHelper: VerifyHelper,
		private usersServices: UsersService
	) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const user = await this.usersServices.findOne({ _id: req.params.id });
		checkRole(req.body.role);
		if (req.body.email) {
			checkEmailPattern(req.body.email);
			if (
				user.email.toLocaleLowerCase() !== req.body.email.toLocaleLowerCase()
			) {
				await this.verifyHelper.checkDuplicateEmail(req.body.email);
			}
		}
		next();
	}
}
