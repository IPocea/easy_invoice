import { Model, Types } from "mongoose";
import { BuyerService } from "src/buyer/buyer.service";
import { ProductService } from "src/product/product.service";
import { SellerService } from "src/seller/seller.service";
import { IMessageResponse, IQueryParams } from "src/utils/shared-interface";
import { CreateFullInvoiceDto, UpdateFullInvoiceDto, UpdateInvoiceDto } from "./dto";
import { IInvoice } from "./interface/invoice.interface";
import { Invoice } from "./schemas/invoice.schema";
import { ContractService } from "src/contract/contract.service";
import { PaymentService } from "src/payment/payment.service";
export declare class InvoiceService {
    private invoiceModel;
    private readonly buyerService;
    private readonly sellerService;
    private readonly contractService;
    private readonly productService;
    private readonly paymentService;
    private ObjectId;
    constructor(invoiceModel: Model<Invoice>, buyerService: BuyerService, sellerService: SellerService, contractService: ContractService, productService: ProductService, paymentService: PaymentService);
    findAllFullInvoice(query: IQueryParams): Promise<any>;
    findOne(query: Object): Promise<IInvoice>;
    findOneFullData(invoiceId: Types.ObjectId): Promise<IInvoice>;
    create(newFullInvoice: CreateFullInvoiceDto): Promise<IInvoice>;
    updateFullInvoice(updateFullInvoice: UpdateFullInvoiceDto, invoiceId: Types.ObjectId): Promise<IInvoice>;
    updateOne(invoiceId: Types.ObjectId, updateInvoiceDto: UpdateInvoiceDto): Promise<IMessageResponse>;
    deleteFullInvoice(invoiceId: Types.ObjectId): Promise<IMessageResponse>;
    deleteOne(invoiceId: Types.ObjectId): Promise<IMessageResponse>;
}
