import { Model, Types } from "mongoose";
import { IMessageResponse } from "src/utils/shared-interface";
import { CreateSellerDto, UpdateSellerDto } from "./dto";
import { ISeller } from "./interface/seller.interface";
import { SellerDocument } from "./schemas/seller.schema";
export declare class SellerService {
    private sellerModel;
    constructor(sellerModel: Model<SellerDocument>);
    create(newSeller: CreateSellerDto): Promise<ISeller>;
    findOne(query: object): Promise<ISeller>;
    updateOne(sellerId: Types.ObjectId, updateSellerDto: UpdateSellerDto): Promise<ISeller>;
    updateOneByInvoiceId(invoiceId: Types.ObjectId, updateSellerDto: UpdateSellerDto): Promise<ISeller>;
    deleteOne(sellerId: Types.ObjectId): Promise<IMessageResponse>;
    deleteOneByInvoiceId(invoiceId: Types.ObjectId): Promise<IMessageResponse>;
}
