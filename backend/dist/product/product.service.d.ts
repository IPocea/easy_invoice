import { Model, Types } from "mongoose";
import { IMessageResponse } from "src/utils/shared-interface";
import { CreateProductDto, UpdateProductDto } from "./dto";
import { IProduct } from "./interface/product.interface";
import { ProductDocument } from "./schemas/product.schema";
export declare class ProductService {
    private productModel;
    constructor(productModel: Model<ProductDocument>);
    findAllOfInvoice(invoiceId: Types.ObjectId): Promise<IProduct[]>;
    create(newProduct: CreateProductDto): Promise<IProduct>;
    createMany(newProducts: CreateProductDto[]): Promise<IMessageResponse>;
    findOne(query: object): Promise<IProduct>;
    updateOne(productId: Types.ObjectId, updatedProductDto: UpdateProductDto): Promise<IMessageResponse>;
    deleteOne(productId: Types.ObjectId): Promise<IMessageResponse>;
    deleteManyByInvoiceId(invoiceId: Types.ObjectId): Promise<IMessageResponse>;
    deleteMany(query: object): Promise<IMessageResponse>;
}
