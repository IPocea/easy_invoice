import { IContractModel } from "./contract-models.interface";

export interface IContractPagination {
	data: IContract[];
	pageIndex: number;
	pageSize: number;
	totalItems: number;
}

export interface IContract {
  _id?: string;
	number: string;
	// date: string;
	subjectOfContract: string;
	// valueOfContract: number;
	paymentAdvance: number;
	restOfPayment: string;
	transport: string;
	installation: string;
	paymentMethod: string;
	deliveryTime: string;
	content: string;
	contractModel: IContractModel;
	invoiceId: string;
	invoice?: any;
	addedBy: string;
	editedBy: string;
	__v?: number;
	createdAt?: string;
	updatedAt?: string;
}