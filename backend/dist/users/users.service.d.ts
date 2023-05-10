import { IUser, IUserPagination } from "./interface/user.interface";
import { UserDocument } from "./schemas/user.schema";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IQueryParams } from "src/utils/shared-interface";
import { TokenService } from "src/token/token.service";
export declare class UsersService {
    private userModel;
    private readonly tokenService;
    private ObjectId;
    constructor(userModel: Model<UserDocument>, tokenService: TokenService);
    create(newUser: CreateUserDto, query: IQueryParams): Promise<IUserPagination>;
    findAll(query: IQueryParams): Promise<IUserPagination>;
    findOne(query: object): Promise<IUser>;
    findOneNoPass(query: object): Promise<IUser>;
    findUserPassword(query: object): Promise<string>;
    update(userId: string, user: UpdateUserDto): Promise<{
        message: string;
    }>;
    toogleUserStatus(userId: string, user: UpdateUserDto, query: IQueryParams): Promise<IUserPagination>;
    updateUser(userId: string, user: UpdateUserDto, query: IQueryParams): Promise<IUserPagination>;
    updatePassword(userId: string, password: string, query: IQueryParams): Promise<IUserPagination>;
    updateOwnPassword(userId: string, password: string): Promise<{
        message: string;
    }>;
    deleteOne(userId: string, query: IQueryParams): Promise<IUserPagination>;
    checkOldPassword(userId: string, password: string): Promise<boolean>;
}
