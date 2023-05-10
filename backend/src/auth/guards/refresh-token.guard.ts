import { HttpException, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import * as jwt from "jsonwebtoken";

@Injectable()
export class RefreshTokenGuard extends AuthGuard("jwt-refresh") {
	handleRequest(err, user, info) {
		// You can throw an exception based on either "info" or "err" arguments
		if (info instanceof jwt.TokenExpiredError) {
			throw new HttpException(
				{
					status: 498,
					error: "Tokenul refresh a expirat",
				},
				498
			);
		}
		if (err || !user) {
			throw new HttpException(
				{
					status: 498,
					error: "Acces interzis",
				},
				498
			);
		}
		return user;
	}
}
