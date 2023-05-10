import { Types } from "mongoose";
export declare class CreateHistoryActionDto {
    actionDescription: string;
    addedBy: string;
    invoiceId?: Types.ObjectId;
    createdAt?: Date;
}
