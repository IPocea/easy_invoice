import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type IndividualDocument = Individual & Document;

@Schema({ timestamps: true })
export class Individual {
	@Prop({ required: true })
	name: string;
	@Prop({ required: true, unique: true })
	series: string;
	@Prop({ required: true, unique: true})
	CNP: string;
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
  @Prop()
	isActivated: boolean;
	@Prop()
	addedBy: string;
	@Prop()
	editedBy: string;
	@Prop()
	createdAt?: Date;
}

export const IndividualSchema = SchemaFactory.createForClass(Individual);
