import mongoose from "mongoose";

export interface ICompanyPagination {
	data: ICompany[];
  pageIndex: number;
  pageSize: number;
  totalItems: number;
}

export interface ICompany {
  _id?: mongoose.Types.ObjectId;
  name: string;
  J: string;
  CUI: string;
  headquarters: string;
  county: string;
  vatRate: number;
  bankAccount?: string;
  bank?: string;
  email?: string;
  phone?: string;
  isActivated?: boolean;
  addedBy?: string;
  editedBy?: string;
  totalSum?: number;
  totalPayment?: number;
  __v?: number;
	createdAt?: Date;
	updatedAt?: Date;
}