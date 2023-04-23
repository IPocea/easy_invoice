import { Types } from "mongoose";

export interface ISeller {
  _id?: Types.ObjectId;
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
	email?: string;
	phone?: string;
	invoiceId: Types.ObjectId;
  __v?: number;
}