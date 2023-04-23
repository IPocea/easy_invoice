import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type SellerDocument = Seller & Document;

@Schema()
export class Seller {
	@Prop({ required: true })
	name: string;
	@Prop({ required: true })
	J: string;
	@Prop({ required: true })
	CUI: string;
	@Prop({ required: true })
	headquarters: string;
	@Prop({ required: true })
	county: string;
	@Prop()
	bankAccount: string;
	@Prop()
	bank: string;
	@Prop()
	treasury: string;
	@Prop()
	socialCapital: number;
	@Prop({ required: true })
	vatRate: number;
	@Prop()
	delegatesName: string;
	@Prop()
	email: string;
	@Prop()
	phone: string;
	@Prop({ required: true })
	invoiceId: Types.ObjectId;
}

export const SellerSchema = SchemaFactory.createForClass(Seller);
