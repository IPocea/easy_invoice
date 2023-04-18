import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ProductDocument = Product & Document;

@Schema()
export class Product {
	@Prop({ required: true })
	name: string;
	@Prop({ required: true })
	quantity: number;
	@Prop({ required: true })
	unitPrice: number;
	@Prop({ required: true })
	VAT: number;
	@Prop({ required: true })
	invoiceId: Types.ObjectId;
	@Prop()
	UM: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
