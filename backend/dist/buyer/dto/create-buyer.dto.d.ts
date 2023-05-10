import { Types } from "mongoose";
export declare class CreateBuyerDto {
    _id?: Types.ObjectId;
    name: string;
    J?: string;
    CUI?: string;
    CNP?: string;
    series?: string;
    headquarters: string;
    county: string;
    bankAccount: string;
    bank: string;
    email?: string;
    phone?: string;
    invoiceId: Types.ObjectId;
}
