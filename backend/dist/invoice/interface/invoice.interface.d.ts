import { Types } from "mongoose";
import { IBuyer } from "src/buyer/interface/buyer.interface";
import { ICompany } from "src/companies/interface/company.interface";
import { IContract } from "src/contract/interface/contract-interface";
import { IIndividual } from "src/individual/interface/inidivual.interface";
import { IPayment } from "src/payment/interface/payment.interface";
import { IProduct } from "src/product/interface/product.interface";
import { ISeller } from "src/seller/interface/seller.interface";
export interface IInvoicePagination {
    data: IInvoice[];
    pageIndex: number;
    pageSize: number;
    totalItems: number;
}
export interface IInvoice {
    _id?: Types.ObjectId;
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
    company?: ICompany;
    individual?: IIndividual;
    buyer?: IBuyer;
    seller?: ISeller;
    products?: IProduct[];
    payments?: IPayment[];
    contract?: IContract;
    totalCost?: number;
    totalPayments?: number;
    addedBy: string;
    editedBy: string;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}
