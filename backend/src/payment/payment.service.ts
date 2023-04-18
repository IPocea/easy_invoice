import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { IMessageResponse } from "src/utils/shared-interface";
import { CreatePaymentDto } from "./dto";
import { IPayment } from "./interface/payment.interface";
import { Payment, PaymentDocument } from "./schemas/payment.schema";

@Injectable()
export class PaymentService {
	private ObjectId = mongoose.Types.ObjectId;

	constructor(
		@InjectModel(Payment.name)
		private paymentModel: Model<PaymentDocument>
	) {}

	async findAllOfInvoice(invoiceId: string): Promise<IPayment[]> {
		try {
			return await this.paymentModel.find({
				invoiceId: new this.ObjectId(`${invoiceId}`),
			});
		} catch (error) {
			return null;
		}
	}

	async create(newPayment: CreatePaymentDto): Promise<IPayment> {
		try {
			const createdPayment = new this.paymentModel(newPayment);
			return await createdPayment.save();
		} catch (error) {
			return null;
		}
	}

	async findOne(query: object): Promise<IPayment> {
		try {
			const payment = await this.paymentModel.findOne(query);
			return payment;
		} catch (error) {
			return null;
		}
	}

	async deleteOne(paymentId: string): Promise<IMessageResponse> {
		try {
			await this.paymentModel.deleteOne({
				_id: new this.ObjectId(`${paymentId}`),
			});
			return {
				message: `Plata cu id-ul ${paymentId} a fost sters`,
			};
		} catch (error) {
			return null;
		}
	}

	async deleteManyById(invoiceId: string): Promise<IMessageResponse> {
		try {
			const result = await this.paymentModel.deleteMany({
				_id: new this.ObjectId(`${invoiceId}`),
			});
			if (result) {
				return {
					message: `Platile pentru factura cu id-ul ${invoiceId} au fost sterse`,
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
