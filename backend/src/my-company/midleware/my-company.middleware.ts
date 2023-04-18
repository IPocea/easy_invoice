import {
	BadRequestException,
	Injectable,
	NestMiddleware,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { MyCompanyService } from "../my-company.service";
import { checkEmptyInputs } from "../../utils/shared-middlewares";

@Injectable()
export class VerifyMyCompany implements NestMiddleware {
	constructor(
		private readonly myCompanyService: MyCompanyService,
	) {}

	async use(req: Request, res: Response, next: NextFunction) {
		checkEmptyInputs(
			req.body.name,
			req.body.J,
			req.body.CUI,
			req.body.headquarters,
			req.body.county,
			req.body.vatRate
		);
		const duplicate = await this.myCompanyService.findOne({
			CUI: {
				$regex: new RegExp("^" + req.body.CUI.toLowerCase() + "$", "i"),
			},
		});
		if (duplicate) {
			throw new BadRequestException("Compania este deja in folosinta!");
		}
		next();
	}
}
