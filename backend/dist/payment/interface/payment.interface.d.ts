import { Types } from "mongoose";
export interface IPayment {
    _id?: Types.ObjectId;
    paymentAmount: number;
    invoiceId: Types.ObjectId;
    addedBy: string;
    editedBy: string;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}
