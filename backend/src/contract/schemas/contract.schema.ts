import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ContractDocument = Contract & Document;

@Schema({ timestamps: true })
export class Contract {
	@Prop({ required: true })
	number: string;
	// @Prop({ required: true})
	// date: Date;
	@Prop({ required: true })
	subjectOfContract: string;
	// @Prop()
	// valueOfContract: number;
	@Prop()
	paymentAdvance: number;
	@Prop()
	restOfPayment: string;
	@Prop()
	transport: string;
	@Prop()
	installation: string;
	@Prop()
	paymentMethod: string;
  @Prop()
	deliveryTime: string;
  @Prop()
	content: string;
  @Prop()
	invoiceId: Types.ObjectId;
	@Prop()
	addedBy: string;
	@Prop()
	editedBy: string;
	@Prop()
	createdAt?: Date;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
