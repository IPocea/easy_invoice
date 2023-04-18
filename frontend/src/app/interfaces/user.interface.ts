import { ITableFilters } from "./common.interface";

export interface IUserPagination {
	data: IUser[];
  pageIndex: number;
  pageSize: number;
  totalItems: number;
}

export interface IUser {
  _id?: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  role?: string;
  isActivated?: boolean;
  __V?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserPreferences {
  paginatorPageSize: number;
}

export interface IUserLoginData {
  username: string;
  password: string;
}

export interface IStatusChoices {
  value: boolean;
  viewValue: string;
}

export interface IDialogData {
  user?: IUser;
  filters?: ITableFilters;
}