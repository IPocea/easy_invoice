export interface IHistoryAction {
  _id?: string;
  actionDescription: string;
  addedBy: string;
  invoiceId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}
