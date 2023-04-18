export interface IPayment {
  _id?: string;
	paymentAmount: number;
	invoiceId: string;
	addedBy: string;
	editedBy: string;
	createdAt?: Date;
	updatedAt?: Date;
	__v?: number;
}