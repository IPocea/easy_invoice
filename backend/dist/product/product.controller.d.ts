import { IMessageResponse } from "src/utils/shared-interface";
import { ProductService } from "./product.service";
import { IProduct } from "./interface/product.interface";
export declare class ProductController {
    private readonly productService;
    private ObjectId;
    constructor(productService: ProductService);
    getAllOfInvoice(invoiceId: string): Promise<IProduct[]>;
    deleteOne(productId: string): Promise<IMessageResponse>;
}
