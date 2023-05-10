import { Types } from "mongoose";
import { CreateBuyerDto } from "src/buyer/dto";
import { CreateContractDto } from "src/contract/dto";
import { CreateProductDto } from "src/product/dto";
import { CreateSellerDto } from "src/seller/dto";
export declare class CreateFullInvoiceDto {
    invoice: CreateInvoiceDto;
    buyer: CreateBuyerDto;
    seller: CreateSellerDto;
    contract: CreateContractDto;
    products: CreateProductDto[];
}
export declare class CreateInvoiceDto {
    typeOfInvoice: string;
    series: string;
    number: string;
    date: Date;
    numberOfAccompanyingNotice: string;
    isCancelled: boolean;
    cancellationNotices: string;
    borderColor: string;
    paymentStatus: boolean;
    companyId?: Types.ObjectId;
    individualId?: Types.ObjectId;
    addedBy: string;
    editedBy: string;
    createdAt?: Date;
}
