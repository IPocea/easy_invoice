import { Types } from "mongoose";

export class CreateProductDto {
  name: string;
	quantity: number;
	unitPrice: number;
	VAT: number;
	invoiceId: Types.ObjectId;
	UM: string;
}