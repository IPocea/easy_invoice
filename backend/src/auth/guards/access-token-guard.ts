import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AccesTokenGuard extends AuthGuard("jwt-access") {
	handleRequest(err, user, info) {
		// You can throw an exception based on either "info" or "err" arguments
		if (err || !user) {
			throw new UnauthorizedException("Token de acces invalid");
		}
		return user;
	}
}
