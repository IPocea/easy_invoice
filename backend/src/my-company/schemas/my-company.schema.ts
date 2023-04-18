import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MyCompanyDocument = MyCompany & Document;

@Schema({ timestamps: true })
export class MyCompany {
	@Prop({ required: true })
	name: string;
	@Prop({ required: true, unique: true })
	J: string;
	@Prop({ required: true, unique: true })
	CUI: string;
	@Prop({ required: true })
	headquarters: string;
	@Prop({ required: true })
	county: string;
	@Prop({ required: true })
	vatRate: number;
	@Prop()
	bankAccount: string;
	@Prop()
	bank: string;
	@Prop()
	treasury: string;
	@Prop()
	delegatesName: string;
	@Prop()
	addedBy: string;
	@Prop()
	editedBy: string;
	@Prop()
	createdAt?: Date;
}

export const MyCompanySchema = SchemaFactory.createForClass(MyCompany);
