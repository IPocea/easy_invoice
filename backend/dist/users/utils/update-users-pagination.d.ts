import { IQueryParams } from "src/utils/shared-interface";
import { CreateUserDto } from "../dto/create-user.dto";
import { IUserPagination } from "../interface/user.interface";
export declare const updateUserAndPaginate: (user: CreateUserDto, model: any, query: IQueryParams) => Promise<IUserPagination>;
