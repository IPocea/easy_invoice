import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ContractModelDocument = ContractModel & Document;

@Schema({ timestamps: true })
export class ContractModel {
	@Prop({ required: true, unique: true })
	name: string;
	@Prop({ required: true })
	content: string;
	@Prop()
	addedBy: string;
	@Prop()
	editedBy: string;
	@Prop()
	createdAt?: Date;
}

export const ContractModelSchema = SchemaFactory.createForClass(ContractModel);
