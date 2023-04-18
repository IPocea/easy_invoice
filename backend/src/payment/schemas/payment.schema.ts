import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
	@Prop({ required: true })
	paymentAmount: number;
	@Prop({ required: true })
	invoiceId: Types.ObjectId;
	@Prop()
	addedBy: string;
	@Prop()
	editedBy: string;
	@Prop()
	createdAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
