import { Types } from "mongoose";

export class CreateContractDto {
	number: string;
	// date: Date;
	subjectOfContract: string;
	// valueOfContract: number;
	paymentAdvance: number;
	restOfPayment: string;
	transport: string;
	installation: string;
	paymentMethod: string;
	deliveryTime: string;
	content: string;
	invoiceId: Types.ObjectId;
	addedBy: string;
	editedBy: string;
	createdAt?: Date;
}
