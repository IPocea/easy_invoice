import { Types } from "mongoose";

export class UpdateSellerDto {
	_id?: Types.ObjectId;
	name?: string;
	J?: string;
	CUI?: string;
	headquarters?: string;
	county?: string;
	bankAccount?: string;
	bank?: string;
	treasury?: string;
	socialCapital?: number;
	vatRate?: number;
	delegatesName?: string;
	email?: string;
	phone?: string;
	invoiceId?: Types.ObjectId;
}
