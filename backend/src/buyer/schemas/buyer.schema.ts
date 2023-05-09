import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type BuyerDocument = Buyer & Document;

@Schema()
export class Buyer {
	@Prop({ required: true })
	name: string;
	@Prop()
	J?: string;
	@Prop()
	CUI?: string;
  @Prop()
	CNP?: string;
	@Prop()
	series?: string;
	@Prop({ required: true })
	headquarters: string;
  @Prop({ required: true })
	county: string;
	@Prop()
	bankAccount: string;
	@Prop()
	bank: string;
	@Prop()
	email: string;
	@Prop()
	phone: string;
	@Prop({ required: true })
	invoiceId: Types.ObjectId;
}

export const BuyerSchema = SchemaFactory.createForClass(Buyer);
