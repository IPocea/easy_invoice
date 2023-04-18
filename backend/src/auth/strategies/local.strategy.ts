import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { IUser } from "../../users/interface/user.interface";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
	constructor(private authService: AuthService) {
		super();
	}

	async validate(username: string, password: string): Promise<IUser> {
		const user = await this.authService.validateUser(username, password);
		if (!user) {
			throw new UnauthorizedException("Username sau parola invalida");
		}
		if (!user.isActivated) {
			throw new UnauthorizedException("User-ul este inactiv!");
		}
		return user;
	}
}
