export interface ISeller {
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
	delegatesName?: string;
	invoiceId: string;
  __v?: number;
}