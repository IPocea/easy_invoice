import { Types } from "mongoose";

export class UpdateBuyerDto {
	_id?: Types.ObjectId;
	name?: string;
	J?: string;
	CUI?: string;
	CNP?: number;
	series?: string;
	headquarters?: string;
	county?: string;
	bankAccount?: string;
	bank?: string;
	invoiceId?: Types.ObjectId;
}
