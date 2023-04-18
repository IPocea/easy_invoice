import { Types } from "mongoose";

export class UpdateContractDto {
	_id?: Types.ObjectId;
  number?: number;
	// date?: Date;
	subjectOfContract?: string;
	// valueOfContract?: number;
	paymentAdvance?: number;
	restOfPayment?: string;
	transport?: string;
	installation?: string;
	paymentMethod?: string;
	deliveryTime?: string;
	content?: string;
	invoiceId?: Types.ObjectId;
	addedBy?: string;
	editedBy?: string;
}