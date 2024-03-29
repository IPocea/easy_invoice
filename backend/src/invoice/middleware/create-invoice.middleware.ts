import {
	BadRequestException,
	Injectable,
	NestMiddleware,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { checkEmptyInputs } from "../../utils/shared-middlewares";
import { InvoiceService } from "../invoice.service";

@Injectable()
export class VerifyInvoiceCreate implements NestMiddleware {
	constructor(private readonly invoiceService: InvoiceService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		checkEmptyInputs(
			req.body.invoice.typeOfInvoice,
			req.body.invoice.series,
			req.body.invoice.number,
			req.body.invoice.date,
			req.body.buyer.name,
			req.body.buyer.headquarters,
			req.body.buyer.county,
			req.body.seller.name,
			req.body.seller.J,
			req.body.seller.CUI,
			req.body.seller.headquarters,
			req.body.seller.county,
			req.body.seller.vatRate,
			req.body.contract.number,
			req.body.contract.subjectOfContract
		);

		for (const product of req.body.products) {
			checkEmptyInputs(
				product.name,
				product.quantity,
				product.unitPrice,
				product.VAT
			);
		}

		if (!req.body.invoice.companyId && !req.body.invoice.individualId) {
			throw new BadRequestException(
				"Factura trebuie sa apartina unei societati sau persoane fizice"
			);
		}

		if (
			(!req.body.buyer.J && !req.body.buyer.series) ||
			(!req.body.buyer.CUI && !req.body.buyer.CNP)
		) {
			throw new BadRequestException(
				"Te rugam sa completezi toate campurile obligatorii"
			);
		}
		const duplicate = await this.invoiceService.findOne({
			number: {
				$regex: new RegExp("^" + req.body.invoice.number + "$"),
			},
		});
		if (duplicate) {
			throw new BadRequestException(
				`Numarul de factura ${req.body.invoice.number} este deja in folosinta!`
			);
		}
		next();
	}
}
