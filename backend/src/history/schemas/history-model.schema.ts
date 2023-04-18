import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type HistoryDocument = HistoryAction & Document;

@Schema({ timestamps: true })
export class HistoryAction {
	@Prop({ required: true })
	actionDescription: string;
	@Prop()
	addedBy: string;
	@Prop()
	invoiceId?: Types.ObjectId;
	@Prop()
	createdAt?: Date;
}

export const HistorySchema = SchemaFactory.createForClass(HistoryAction);
