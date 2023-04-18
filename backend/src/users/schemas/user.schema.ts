import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
	@Prop({ required: true, unique: true })
	username: string;

	@Prop({ required: true })
	password: string;

	@Prop({ required: true })
	email: string;

	@Prop({ required: true })
	firstName: string;

	@Prop({ required: true })
	lastName: string;

	@Prop({ required: true })
	role: string;

	@Prop({ required: true })
	isActivated: boolean;

	@Prop()
	createdAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
