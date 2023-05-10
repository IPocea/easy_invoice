import { Model, Types } from "mongoose";
import { IMessageResponse } from "src/utils/shared-interface";
import { CreateBuyerDto, UpdateBuyerDto } from "./dto";
import { IBuyer } from "./interface/buyer.interface";
import { BuyerDocument } from "./schemas/buyer.schema";
export declare class BuyerService {
    private buyerModel;
    constructor(buyerModel: Model<BuyerDocument>);
    create(newBuyer: CreateBuyerDto): Promise<IBuyer>;
    findOne(query: object): Promise<IBuyer>;
    updateOne(buyerId: Types.ObjectId, updateBuyerDto: UpdateBuyerDto): Promise<IBuyer>;
    updateOneByInvoiceId(invoiceId: Types.ObjectId, updateBuyerDto: UpdateBuyerDto): Promise<IBuyer>;
    deleteOne(buyerId: Types.ObjectId): Promise<IMessageResponse>;
    deleteOneByInvoiceId(invoiceId: Types.ObjectId): Promise<IMessageResponse>;
}
