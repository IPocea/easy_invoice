import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Param,
	Post,
	Req,
	UseGuards,
} from "@nestjs/common";
import { Types } from "mongoose";
import { PaymentService } from "./payment.service";
import { AccesTokenGuard } from "src/auth/guards/access-token-guard";
import { IPayment } from "./interface/payment.interface";
import { CreatePaymentDto } from "./dto";
import { HistoryService } from "src/history/history.service";
import { divide } from "src/utils/shared-operators";

@Controller("payments")
export class PaymentController {
	private ObjectId = Types.ObjectId;

	constructor(
		private readonly paymentService: PaymentService,
		private readonly historyService: HistoryService
	) {}

	@UseGuards(AccesTokenGuard)
	@Get(":invoiceId")
	async getAllOfInvoice(
		@Param("invoiceId") invoiceId: string
	): Promise<IPayment[]> {
		if (!this.ObjectId.isValid(invoiceId)) {
			throw new BadRequestException("Formatul de id introdus nu este valid");
		}
		return await this.paymentService.findAllOfInvoice(
			new this.ObjectId(`${invoiceId}`)
		);
	}

	@UseGuards(AccesTokenGuard)
	@Post(":invoiceId/add")
	async addPayment(
		@Body() paymentDto: CreatePaymentDto,
		@Param("invoiceId") invoiceId: string,
		@Req() req
	): Promise<IPayment[]> {
		if (!this.ObjectId.isValid(invoiceId)) {
			throw new BadRequestException("Formatul de id introdus nu este valid");
		}
		const user = req.user;
		const invoiceObjectId = new this.ObjectId(`${invoiceId}`);
		const result =
			await this.paymentService.createAndUpdateInvoicePaymentStatus(
				paymentDto,
				invoiceObjectId,
				user
			);
		if (result) {
			await this.historyService.create({
				actionDescription: `Plata de ${divide(
					result.paymentAmount,
					100
				)} RON a fost adaugata`,
				addedBy: user.firstName + " " + user.lastName,
				invoiceId: invoiceObjectId,
			});
		}

		return await this.paymentService.findAllOfInvoice(invoiceObjectId);
	}
}
