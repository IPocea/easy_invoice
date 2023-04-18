import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
	@Prop({ required: true })
	name: string;
	@Prop({ required: true})
	J: string;
	@Prop({ required: true, unique: true })
	CUI: string;
	@Prop({ required: true })
	headquarters: string;
	@Prop({ required: true })
	county: string;
	@Prop()
	vatRate: number;
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

export const CompanySchema = SchemaFactory.createForClass(Company);
