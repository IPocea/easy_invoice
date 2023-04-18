import {
	BadRequestException,
	Injectable,
	NestMiddleware,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { checkEmptyInputs } from "src/utils/shared-middlewares";
import { IndividualService } from "../individual.service";

@Injectable()
export class VerifyIndividualUpdate implements NestMiddleware {
	constructor(private readonly individualService: IndividualService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		checkEmptyInputs(
			req.body.name,
			req.body.series,
			req.body.CNP,
			req.body.headquarters,
			req.body.county
		);
		const ObjectId = mongoose.Types.ObjectId;
		const individual = await this.individualService.findOne({
			_id: new ObjectId(`${req.params.id}`),
		});
		if (individual.CNP !== req.body.CNP) {
			const duplicate = await this.individualService.findOne({
				CNP: {
					$regex: new RegExp("^" + req.body.CNP.toLowerCase() + "$", "i"),
				},
			});
			if (duplicate) {
				throw new BadRequestException(
					`CNP-ul ${req.body.CNP} este deja in folosinta!`
				);
			}
		}
		next();
	}
}
