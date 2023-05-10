import { Types } from "mongoose";
export declare class CreatePaymentDto {
    paymentAmount: number;
    invoiceId: Types.ObjectId;
    addedBy: string;
    editedBy: string;
    createdAt?: Date;
}
