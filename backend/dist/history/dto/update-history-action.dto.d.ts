import { Types } from "mongoose";
export declare class UpdateHistoryActionDto {
    actionDescription?: string;
    addedBy?: string;
    invoiceId?: Types.ObjectId;
    createdAt?: Date;
}
