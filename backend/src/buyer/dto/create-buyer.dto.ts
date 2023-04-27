import { Types } from "mongoose";

export class CreateBuyerDto {
	_id?: Types.ObjectId;
	name: string;
	J?: string;
	CUI?: string;
	CNP?: number;
	series?: string;
	headquarters: string;
	county: string;
	bankAccount: string;
	bank: string;
	email?: string;
	phone?: string;
	invoiceId: Types.ObjectId;
}
