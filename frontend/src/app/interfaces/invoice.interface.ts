import {
  IBuyer,
  ICompany,
  IContract,
  IIndividual,
  IPayment,
  IProduct,
  ISeller,
} from '@interfaces';

export interface IInvoicePagination {
  data: IInvoice[];
  pageIndex: number;
  pageSize: number;
  totalItems: number;
}

export interface IInvoice {
  _id?: string;
  typeOfInvoice: string;
  series: string;
  number: string;
  date: string;
  numberOfAccompanyingNotice: string;
  isCancelled: boolean;
  cancellationNotices: string;
  borderColor: string;
  paymentStatus: boolean;
  companyId?: string;
  individualId?: string;
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
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ICreateInvoice {
  invoice: IInvoice;
  buyer: IBuyer;
  seller: ISeller;
  contract: IContract;
  products: IProduct[];
}

export interface IToggleInvoiceStatus {
  isCancelled: boolean;
  editedBy: string;
  cancellationNotices?: string;
}
