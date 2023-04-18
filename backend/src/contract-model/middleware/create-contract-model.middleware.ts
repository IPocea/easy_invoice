import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { checkEmptyInputs } from "../../utils/shared-middlewares";
import { ContractModelService } from "../contract-model.service";

@Injectable()
export class VerifyContractModelCreate implements NestMiddleware {
	constructor(private contractModelService: ContractModelService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		checkEmptyInputs(req.body.name, req.body.content);
		const duplicate = await this.contractModelService.findOne({
			name: {
				$regex: new RegExp("^" + req.body.name.toLowerCase() + "$", "i"),
			},
		});
		if(duplicate) {
			throw new BadRequestException("Numele este deja in folosinta!");
		}
		next();
	}
}
