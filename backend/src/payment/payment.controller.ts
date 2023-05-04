import {
	Body,
	Controller,
	Delete,
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
import { checkAdminRole } from "src/users/helpers/check-admin-role";

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
		return await this.paymentService.findAllOfInvoice(
			new this.ObjectId(`${invoiceId}`)
		);
	}

	@UseGuards(AccesTokenGuard)
	@Post("add")
	async addPayment(
		@Body() paymentDto: CreatePaymentDto,
		@Req() req
	): Promise<IPayment[]> {
		const user = req.user;
		const invoiceObjectId = new this.ObjectId(`${paymentDto.invoiceId}`);
		paymentDto.invoiceId = invoiceObjectId;
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

	@UseGuards(AccesTokenGuard)
	@Delete(":paymentId/:invoiceId/delete-payment")
	async deletePayment(
		@Param("paymentId") paymentId: string,
		@Param("invoiceId") invoiceId: string,
		@Req() req
	): Promise<IPayment[]> {
		const user = req.user;
		checkAdminRole(user.role);
		const paymentObjectId = new this.ObjectId(`${paymentId}`);
		const invoiceObjectId = new this.ObjectId(`${invoiceId}`);
		const initialPayment = await this.paymentService.findOne(paymentObjectId);
		const result =
			await this.paymentService.deleteAndUpdateInvoicePaymentStatus(
				paymentObjectId,
				invoiceObjectId,
				user
			);
		if (result) {
			await this.historyService.create({
				actionDescription: `Plata de ${initialPayment.paymentAmount} RON a fost stearsa`,
				addedBy: user.firstName + " " + user.lastName,
				invoiceId: invoiceObjectId,
			});
		}

		return await this.paymentService.findAllOfInvoice(invoiceObjectId);
	}
}
