import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, Types } from "mongoose";
import { IMessageResponse } from "src/utils/shared-interface";
import { CreatePaymentDto } from "./dto";
import { IPayment } from "./interface/payment.interface";
import { Payment, PaymentDocument } from "./schemas/payment.schema";
import { multiply } from "src/utils/shared-operators";
import {
	getAllOfInvoiceAggArray,
	getInvoiceFromPaymentsController,
	getOneByIdAggArray,
} from "./utils";
import { Invoice, InvoiceDocument } from "src/invoice/schemas/invoice.schema";
import { IInvoice } from "src/invoice/interface/invoice.interface";
import { IUser } from "src/users/interface/user.interface";

@Injectable()
export class PaymentService {
	private ObjectId = mongoose.Types.ObjectId;

	constructor(
		@InjectModel(Payment.name)
		private paymentModel: Model<PaymentDocument>,
		@InjectModel(Invoice.name)
		private invoiceModel: Model<InvoiceDocument>
	) {}

	async findAllOfInvoice(invoiceId: Types.ObjectId): Promise<IPayment[]> {
		try {
			const aggrArray = getAllOfInvoiceAggArray(invoiceId);
			return await this.paymentModel.aggregate(aggrArray);
		} catch (error) {
			return null;
		}
	}

	async create(newPayment: CreatePaymentDto): Promise<IPayment> {
		try {
			newPayment.paymentAmount = multiply(newPayment.paymentAmount, 100);
			const createdPayment = new this.paymentModel(newPayment);
			return await createdPayment.save();
		} catch (error) {
			return null;
		}
	}

	async createAndUpdateInvoicePaymentStatus(
		newPayment: CreatePaymentDto,
		invoiceId: Types.ObjectId,
		user: IUser
	): Promise<IPayment> {
		try {
			const aggArray = getInvoiceFromPaymentsController(invoiceId);
			const payment = await this.create(newPayment);
			if (payment) {
				const invoiceResult = await this.invoiceModel.aggregate(aggArray);
				const invoice: IInvoice = invoiceResult[0];
				if (invoice) {
					const paymentStatus =
						invoice.totalPayments >= invoice.totalCost ? true : false;
					await this.invoiceModel.findOneAndUpdate(
						{ _id: invoiceId },
						{
							paymentStatus: paymentStatus,
							editedBy: user.firstName + " " + user.lastName,
						},
						{ new: true }
					);
				}
			}
			return payment;
		} catch (error) {
			return null;
		}
	}

	async findOne(paymentId: Types.ObjectId): Promise<IPayment> {
		try {
			const aggrArray = getOneByIdAggArray(paymentId);
			const paymentArray = await this.paymentModel.aggregate(aggrArray);
			return paymentArray[0];
		} catch (error) {
			return null;
		}
	}

	async deleteOne(paymentId: Types.ObjectId): Promise<IMessageResponse> {
		try {
			await this.paymentModel.deleteOne({
				_id: paymentId,
			});
			return {
				message: `Plata cu id-ul ${paymentId.toString()} a fost sters`,
			};
		} catch (error) {
			return null;
		}
	}

	async deleteAndUpdateInvoicePaymentStatus(
		paymentId: Types.ObjectId,
		invoiceId: Types.ObjectId,
		user: IUser
	): Promise<IMessageResponse> {
		try {
			const aggArray = getInvoiceFromPaymentsController(invoiceId);
			const deleteResult = await this.deleteOne(paymentId);
			if (deleteResult) {
				const invoiceResult = await this.invoiceModel.aggregate(aggArray);
				const invoice: IInvoice = invoiceResult[0];
				if (invoice) {
					const paymentStatus =
						invoice.totalPayments >= invoice.totalCost ? true : false;
					await this.invoiceModel.findOneAndUpdate(
						{ _id: invoiceId },
						{
							paymentStatus: paymentStatus,
							editedBy: user.firstName + " " + user.lastName,
						},
						{ new: true }
					);
				}
				return { message: "Plata a fost stearsa cu succes" };
			} else {
				return null;
			}
		} catch (error) {
			return null;
		}
	}

	async deleteManyByInvoiceId(
		invoiceId: Types.ObjectId
	): Promise<IMessageResponse> {
		try {
			const result = await this.paymentModel.deleteMany({
				invoiceId: invoiceId,
			});
			if (result) {
				return {
					message: `Platile pentru factura cu id-ul ${invoiceId.toString()} au fost sterse`,
				};
			}
		} catch (error) {
			return null;
		}
	}

	async deleteMany(query: object): Promise<IMessageResponse> {
		try {
			const result = await this.paymentModel.deleteMany(query);
			if (result) {
				return {
					message: `Platile pentru factura selectata au fost sterse`,
				};
			}
		} catch (error) {
			return null;
		}
	}
}
