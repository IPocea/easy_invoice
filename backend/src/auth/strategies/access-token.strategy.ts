import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import {
	IPayload,
	IValidateStrategyResponse,
} from "../interface/payload.interface";
import { jwtConstants } from "../constants";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
	Strategy,
	"jwt-access"
) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConstants.accessTokenSecret,
		});
	}

	async validate(payload: IPayload): Promise<IValidateStrategyResponse> {
		return {
			_id: payload.sub,
			username: payload.username,
			firstName: payload.firstName,
			lastName: payload.lastName,
			role: payload.role,
		};
	}
}
