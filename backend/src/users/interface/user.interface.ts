export interface IUserPagination {
	data: IUser[];
  pageIndex: number;
  pageSize: number;
  totalItems: number;
}

export interface IUser {
	_id?: string;
	username: string;
	firstName: string;
	lastName: string;
	password?: string;
	email: string;
	role: string;
	isActivated: boolean;
	__v?: number;
	createdAt?: Date;
	updatedAt?: Date;
}
export interface IUserLoginData {
	username: string;
	password: string;
}
