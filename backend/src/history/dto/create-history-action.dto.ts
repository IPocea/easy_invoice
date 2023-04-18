import { Types } from "mongoose";

export class CreateHistoryActionDto {
	actionDescription: string;
	addedBy: string;
	invoiceId?: Types.ObjectId;
	createdAt?: Date;
}
