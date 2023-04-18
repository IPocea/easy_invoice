import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "../users.service";

// This services are used in verifySignup and verifyModify middlewares
@Injectable()
export class VerifyHelper {
	constructor(private readonly userService: UsersService) {}

	async checkDuplicateEmail(email: string): Promise<void> {
		const user = await this.userService.findOne({
			email: {
				$regex: new RegExp("^" + email.toLowerCase() + "$", "i"),
			},
		});
		if (user) {
			throw new BadRequestException("Emailul este deja in folosinta!");
		}
	}

	async checkDuplicateUser(username: string): Promise<void> {
		const user = await this.userService.findOne({
			username: {
				$regex: new RegExp("^" + username.toLowerCase() + "$", "i"),
			},
		});
		if (user) {
			throw new BadRequestException("Username-ul este deja in folosinta!");
		}
	}
}
