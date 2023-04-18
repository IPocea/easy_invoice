export class CreateCompanyDto {
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
  createdAt?: Date;
}