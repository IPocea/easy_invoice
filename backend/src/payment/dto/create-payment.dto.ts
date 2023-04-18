import { Types } from "mongoose";

export class CreatePaymentDto {
  paymentAmount: number;
	invoiceId: Types.ObjectId;
	addedBy: string;
	editedBy: string;
	createdAt?: Date;
}