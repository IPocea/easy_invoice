import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IUser } from "./interface/user.interface";
import { UsersService } from "./users.service";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(req: any): Promise<IUser[]>;
    findOne(req: any, userId: string): Promise<IUser>;
    signup(req: any, user: CreateUserDto): Promise<IUser>;
    updateOne(req: any, userId: string, body: UpdateUserDto): Promise<{
        message: string;
    }>;
    deleteOne(req: any, userId: string): Promise<{
        message: string;
    }>;
}
