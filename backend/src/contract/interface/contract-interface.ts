import { Types } from "mongoose";

export interface IContractPagination {
	data: IContract[];
	pageIndex: number;
	pageSize: number;
	totalItems: number;
}

export interface IContract {
	_id?: Types.ObjectId;
	number: string;
	// date: Date;
	subjectOfContract: string;
	// valueOfContract: number;
	paymentAdvance: number;
	restOfPayment: string;
	transport: string;
	installation: string;
	paymentMethod: string;
	deliveryTime: string;
	content: string;
	invoiceId: Types.ObjectId;
	invoice?: any;
	addedBy: string;
	editedBy: string;
	__v?: number;
	createdAt?: Date;
	updatedAt?: Date;
}
