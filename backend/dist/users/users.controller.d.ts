import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IUser, IUserPagination } from "./interface/user.interface";
import { UsersService } from "./users.service";
import { IQueryParams } from "src/utils/shared-interface";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(req: any, query: IQueryParams): Promise<IUserPagination>;
    findOne(req: any, userId: string): Promise<IUser>;
    signup(req: any, query: IQueryParams, user: CreateUserDto): Promise<IUserPagination>;
    updateOne(req: any, userId: string, query: IQueryParams, body: UpdateUserDto): Promise<IUserPagination>;
    updateUser(req: any, userId: string, query: IQueryParams, body: UpdateUserDto): Promise<IUserPagination>;
    changePassword(req: any, userId: string, query: IQueryParams, password: {
        password: string;
    }): Promise<IUserPagination>;
    deleteOne(req: any, userId: string, query: IQueryParams): Promise<IUserPagination>;
}
