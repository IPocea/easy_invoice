import { Types } from "mongoose";

export class UpdateProductDto {
	_id?: Types.ObjectId;
  name?: string;
	quantity?: number;
	unitPrice?: number;
	VAT?: number;
	invoiceId?: Types.ObjectId;
	UM?: string;
}