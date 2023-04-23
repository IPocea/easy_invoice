export interface IMyCompany {
  _id?: string;
  name: string;
  J: string;
  CUI: string;
  headquarters: string;
  county: string;
  bankAccount?: string;
  bank?: string;
  treasury?: string;
  socialCapital?: number;
  vatRate: number;
  email?: string;
  phone?: string;
  delegatesName?: string;
  addedBy: string | null;
  editedBy: string | null;
  __V?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICompanyPagination {
	data: ICompany[];
  pageIndex: number;
  pageSize: number;
  totalItems: number;
}

export interface ICompany {
  _id?: string;
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