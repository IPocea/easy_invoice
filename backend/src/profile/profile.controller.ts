import {
	Controller,
	Get,
	UseGuards,
	Request,
	Patch,
	Body,
	ForbiddenException,
} from "@nestjs/common";
import { IUser } from "src/users/interface/user.interface";
import { AccesTokenGuard } from "../auth/guards/access-token-guard";
import { UsersService } from "../users/users.service";
import { IChangePasswordBody } from "./interface/profile.interface";

@Controller("profile")
export class ProfileController {
	constructor(private readonly usersServices: UsersService) {}

	// Protected routes
	@UseGuards(AccesTokenGuard)
	@Get()
	async getProfile(@Request() req): Promise<IUser> {
		return await this.usersServices.findOneNoPass({ _id: req.user._id });
	}

	@UseGuards(AccesTokenGuard)
	@Patch("change-password")
	async updatePassword(
		@Request() req,
		@Body() changePassBody: IChangePasswordBody
	): Promise<{ message: string }> {
		if (req.user._id !== changePassBody.userId) {
			throw new ForbiddenException("Poti nodifica doar parola ta");
		}
		return await this.usersServices.updateOwnPassword(
			changePassBody.userId,
			changePassBody.password
		);
	}
}
