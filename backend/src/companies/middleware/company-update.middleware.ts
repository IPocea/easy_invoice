import {
	BadRequestException,
	Injectable,
	NestMiddleware,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { checkEmptyInputs } from "../../utils/shared-middlewares";
import { CompanyService } from "../company.service";

@Injectable()
export class VerifyCompanyUpdate implements NestMiddleware {
	constructor(private readonly companyService: CompanyService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		checkEmptyInputs(
			req.body.name,
			req.body.J,
			req.body.CUI,
			req.body.headquarters,
			req.body.county
		);
		const ObjectId = mongoose.Types.ObjectId;
		const company = await this.companyService.findOne({
			_id: new ObjectId(`${req.params.id}`),
		});
		if (company.CUI !== req.body.CUI) {
			const duplicate = await this.companyService.findOne({
				CUI: {
					$regex: new RegExp("^" + req.body.CUI.toLowerCase() + "$", "i"),
				},
			});
			if (duplicate) {
				throw new BadRequestException(
					`CUI-ul ${req.body.CUI} este deja in folosinta!`
				);
			}
		}
		next();
	}
}
