import { BadRequestException, Injectable } from "@nestjs/common";
import { IUser, IUserPagination } from "./interface/user.interface";
import * as bcrypt from "bcrypt";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import mongoose, { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
// import { getUsersPagination } from "./utils/get-users-pagination";
import { IQueryParams } from "src/utils/shared-interface";
import { getPagination } from "src/utils/shared-pagination";
import { TokenService } from "src/token/token.service";

@Injectable()
export class UsersService {
	private ObjectId = mongoose.Types.ObjectId;
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		private readonly tokenService: TokenService
	) {}
	async create(
		newUser: CreateUserDto,
		query: IQueryParams
	): Promise<IUserPagination> {
		try {
			newUser.password = bcrypt.hashSync(newUser.password, 8);
			const createdUser = new this.userModel(newUser);
			await createdUser.save();
			const filters = {
				pageIndex: "0",
				pageSize: query?.pageSize?.toString() || "10",
			};
			return await getPagination(this.userModel, filters);
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	async findAll(query: IQueryParams): Promise<IUserPagination> {
		return await getPagination(this.userModel, query);
	}

	async findOne(query: object): Promise<IUser> {
		try {
			const user = await this.userModel.findOne(query);
			return user;
		} catch (error) {
			return null;
		}
	}

	// find an user and return it without password
	async findOneNoPass(query: object): Promise<IUser> {
		try {
			const user = await this.userModel.findOne(query).select("-password");
			return user;
		} catch (error) {
			return null;
		}
	}

	async findUserPassword(query: object): Promise<string> {
		try {
			const user = await this.userModel.findOne(query).select("password");
			return user.password;
		} catch (error) {
			return null;
		}
	}

	async update(
		userId: string,
		user: UpdateUserDto
	): Promise<{ message: string }> {
		try {
			await this.userModel.updateOne(
				{ _id: new this.ObjectId(`${userId}`) },
				user
			);
			return { message: `Userul cu id-ul ${userId} a fost actualizat` };
		} catch (error) {
			return null;
		}
	}

	async toogleUserStatus(
		userId: string,
		user: UpdateUserDto,
		query: IQueryParams
	): Promise<IUserPagination> {
		try {
			await this.userModel.updateOne(
				{ _id: new this.ObjectId(`${userId}`) },
				user
			);
			if (!user.isActivated) {
				await this.tokenService.update(userId, null, "refresh");
			}
			return await getPagination(this.userModel, query);
		} catch (error) {
			return null;
		}
	}

	async updateUser(
		userId: string,
		user: UpdateUserDto,
		query: IQueryParams
	): Promise<IUserPagination> {
		try {
			await this.userModel.updateOne(
				{ _id: new this.ObjectId(`${userId}`) },
				user
			);
			if (!user.isActivated) {
				await this.tokenService.update(userId, null, "refresh");
			}
			return await getPagination(this.userModel, query);
		} catch (error) {
			return null;
		}
	}

	async updatePassword(
		userId: string,
		password: string,
		query: IQueryParams
	): Promise<IUserPagination> {
		const duplicate = await this.checkOldPassword(userId, password);
		if (duplicate) {
			throw new BadRequestException(
				"Parola noua nu poate fi identica cu cea veche"
			);
		}
		try {
			const newPass = bcrypt.hashSync(password, 8);
			await this.userModel.updateOne(
				{ _id: new this.ObjectId(`${userId}`) },
				{ password: newPass }
			);
			return await getPagination(this.userModel, query);
		} catch (error) {
			return null;
		}
	}

	async updateOwnPassword(
		userId: string,
		password: string
	): Promise<{ message: string }> {
		const duplicate = await this.checkOldPassword(userId, password);
		if (duplicate) {
			throw new BadRequestException(
				"Parola noua nu poate fi identica cu cea veche"
			);
		}
		try {
			const newPass = bcrypt.hashSync(password, 8);
			await this.userModel.updateOne(
				{ _id: new this.ObjectId(`${userId}`) },
				{ password: newPass }
			);
			return { message: "Parola a fost modificata cu succes" };
		} catch (error) {
			return null;
		}
	}

	async deleteOne(
		userId: string,
		query: IQueryParams
	): Promise<IUserPagination> {
		try {
			await this.userModel.deleteOne({ _id: new this.ObjectId(`${userId}`) });
			return await getPagination(this.userModel, query);
		} catch (error) {
			return null;
		}
	}

	async checkOldPassword(userId: string, password: string): Promise<boolean> {
		try {
			const oldPassword = await this.findUserPassword({
				_id: new this.ObjectId(`${userId}`),
			});
			const passwordValid = bcrypt.compareSync(password, oldPassword);
			return passwordValid;
		} catch (error) {
			return null;
		}
	}
}
