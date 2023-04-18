import { Types } from "mongoose";

export class CreateSellerDto {
	name: string;
	J: string;
	CUI: string;
	headquarters: string;
	county: string;
	bankAccount?: string;
	bank?: string;
	treasury?: string;
	socialCapital?: number;
	vatRate: number;
	delegatesName?: string;
	invoiceId: Types.ObjectId;
}