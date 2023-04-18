import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type InvoiceDocument = Invoice & Document;

@Schema({ timestamps: true })
export class Invoice {
	@Prop({ required: true })
	typeOfInvoice: string;
	@Prop({ required: true })
	series: string;
	@Prop({ required: true, unique: true })
	number: string;
	@Prop({ required: true })
	date: Date;
	@Prop()
	numberOfAccompanyingNotice: string;
	@Prop()
	isCancelled: boolean;
	@Prop()
	cancellationNotices: string;
	@Prop()
	borderColor: string;
	@Prop()
	paymentStatus: boolean;
	@Prop()
	companyId?: Types.ObjectId;
	@Prop()
	individualId?: Types.ObjectId;
	@Prop()
	addedBy: string;
	@Prop()
	editedBy: string;
	@Prop()
	createdAt?: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
