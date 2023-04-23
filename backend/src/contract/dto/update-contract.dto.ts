import { Types } from "mongoose";
import { IContractModel } from "src/contract-model/interface/contract-model.interface";

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
	contractModel?: IContractModel;
	invoiceId?: Types.ObjectId;
	addedBy?: string;
	editedBy?: string;
}