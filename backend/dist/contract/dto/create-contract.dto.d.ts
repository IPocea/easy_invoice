import { Types } from "mongoose";
import { IContractModel } from "src/contract-model/interface/contract-model.interface";
export declare class CreateContractDto {
    number: string;
    subjectOfContract: string;
    paymentAdvance: number;
    restOfPayment: string;
    transport: string;
    installation: string;
    paymentMethod: string;
    deliveryTime: string;
    content: string;
    contractModel: IContractModel;
    invoiceId: Types.ObjectId;
    addedBy: string;
    editedBy: string;
    createdAt?: Date;
}
