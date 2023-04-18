import { Types } from "mongoose";

export interface IHistoryAction {
  _id?: Types.ObjectId;
  actionDescription: string;
	addedBy: string;
	invoiceId?: Types.ObjectId;
	createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}