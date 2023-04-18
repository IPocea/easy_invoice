import {
	Controller,
	Get,
	NotFoundException,
	Param,
	Patch,
	Request,
	Body,
	ForbiddenException,
	Delete,
	Post,
	BadRequestException,
	UseGuards,
	Query,
} from "@nestjs/common";
import { AccesTokenGuard } from "src/auth/guards/access-token-guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IUser, IUserPagination } from "./interface/user.interface";
import { UsersService } from "./users.service";
import { checkAdminRole } from "./helpers/check-admin-role";
import { IQueryParams } from "src/utils/shared-interface";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(AccesTokenGuard)
	@Get()
	async findAll(
		@Request() req,
		@Query() query: IQueryParams
	): Promise<IUserPagination> {
		checkAdminRole(req.user.role);
		return await this.usersService.findAll(query);
	}

	@UseGuards(AccesTokenGuard)
	@Get(":id")
	async findOne(@Request() req, @Param("id") userId: string): Promise<IUser> {
		checkAdminRole(req.user.role);
		const user = await this.usersService.findOneNoPass({ _id: userId });
		if (!user)
			throw new NotFoundException(
				`Nu am putut gasi user-ul cu id-ul ${userId}`
			);
		return user;
	}

	@UseGuards(AccesTokenGuard)
	@Post("add")
	async signup(
		@Request() req,
		@Query() query: IQueryParams,
		@Body() user: CreateUserDto
	): Promise<IUserPagination> {
		checkAdminRole(req.user.role);
		try {
			return await this.usersService.create(user, query);
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@UseGuards(AccesTokenGuard)
	@Patch(":id")
	async updateOne(
		@Request() req,
		@Param("id") userId: string,
		@Query() query: IQueryParams,
		@Body() body: UpdateUserDto
	): Promise<IUserPagination> {
		checkAdminRole(req.user.role);
		if (body.hasOwnProperty("password")) throw new ForbiddenException();
		const result = await this.usersService.toogleUserStatus(
			userId,
			body,
			query
		);
		if (!result) {
			throw new NotFoundException(`Nu pot gasi user-ul cu id-ul ${userId}`);
		}
		return result;
	}

	@UseGuards(AccesTokenGuard)
	@Patch(":id/edit-user")
	async updateUser(
		@Request() req,
		@Param("id") userId: string,
		@Query() query: IQueryParams,
		@Body() body: UpdateUserDto
	): Promise<IUserPagination> {
		checkAdminRole(req.user.role);
		if (body.hasOwnProperty("password")) throw new ForbiddenException();
		const result = await this.usersService.updateUser(userId, body, query);
		if (!result) {
			throw new NotFoundException(`Nu pot gasi user-ul cu id-ul ${userId}`);
		}
		return result;
	}

	@UseGuards(AccesTokenGuard)
	@Patch(":id/change-password")
	async changePassword(
		@Request() req,
		@Param("id") userId: string,
		@Query() query: IQueryParams,
		@Body() password: { password: string }
	): Promise<IUserPagination> {
		checkAdminRole(req.user.role);
		const result = await this.usersService.updatePassword(
			userId,
			password.password,
			query
		);
		if (!result) {
			throw new BadRequestException();
		}
		return result;
	}

	@UseGuards(AccesTokenGuard)
	@Delete(":id")
	async deleteOne(
		@Request() req,
		@Param("id") userId: string,
		@Query() query: IQueryParams
	): Promise<IUserPagination> {
		checkAdminRole(req.user.role);
		const result = await this.usersService.deleteOne(userId, query);
		if (!result)
			throw new NotFoundException(
				`Nu am putut sterge user-ul cu id-ul ${userId}. Poate ca userul nu exista`
			);
		return result;
	}
}
