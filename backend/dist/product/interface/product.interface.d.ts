import { Types } from "mongoose";
export interface IProduct {
    _id?: Types.ObjectId;
    name: string;
    quantity: number;
    unitPrice: number;
    VAT: number;
    invoiceId: Types.ObjectId;
    UM: string;
    __v?: number;
}
