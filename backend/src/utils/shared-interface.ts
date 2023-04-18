import { Types } from "mongoose";

export interface IQueryParams {
	pageIndex?: string;
	pageSize?: string;
	sortBy?: string;
	searchValue?: string;
	sortDirection?: string;
}

export interface IMessageResponse {
	message: string;
}

export interface IQueryParamsForDeletingInvoice {
	invoiceId: string;
	buyerId: string;
	sellerId: string;
}
