export interface IIndividualPagination {
  data: IIndividual[];
  pageIndex: number;
  pageSize: number;
  totalItems: number;
}

export interface IIndividual {
  _id?: string;
  name: string;
  series: string;
  CNP: string;
  headquarters: string;
  county: string;
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
