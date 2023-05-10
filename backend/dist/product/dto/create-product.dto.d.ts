import { Types } from "mongoose";
export declare class CreateProductDto {
    name: string;
    quantity: number;
    unitPrice: number;
    VAT: number;
    invoiceId: Types.ObjectId;
    UM: string;
}
