import { ForbiddenException, Injectable } from "@nestjs/common";
import { IUser } from "../users/interface/user.interface";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { TokenService } from "../token/token.service";
import { IAuthTokens } from "./interface/token.interface";
import { IPayload } from "./interface/payload.interface";
import { jwtConstants } from "./constants";

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private jwtService: JwtService,
		private tokenService: TokenService
	) {}

	async validateUser(username: string, password: string): Promise<IUser> {
		// search user by case-insensitive username
		const user = await this.usersService.findOne({
			username: {
				$regex: new RegExp("^" + username.toLowerCase() + "$", "i"),
			},
		});
		if (!user) return null;
		const passwordValid = await bcrypt.compare(password, user.password);
		if (user && passwordValid) {
			return user;
		}
		return null;
	}

	async validateResetToken(payload: IPayload): Promise<string> {
		const resetPasswordToken = (
			await this.tokenService.findOne({ userId: payload.sub })
		)?.resetPasswordToken;
		if (!resetPasswordToken) {
			return null;
		}
		return resetPasswordToken;
	}

	// On login we get the tokens, we check if the token exists in database in order to create or update it
	async login(user: IUser): Promise<IAuthTokens> {
		const tokens = await this.getTokens(
			user._id,
			user.username,
			user.email,
			user.role,
			user.firstName,
			user.lastName
		);
		const isTokenInDatabase = await this.tokenService.findOne({
			userId: user._id,
		});
		if (!isTokenInDatabase) {
			const hashedRefreshToken = this.hasData(tokens.refreshToken);
			await this.tokenService.create({
				userId: user._id,
				refreshToken: hashedRefreshToken,
			});
		} else {
			await this.updateRefreshTokens(user._id, tokens.refreshToken);
		}
		return tokens;
	}

	// On logout we delete the refresh token from database
	async logout(user: IUser): Promise<{ message: string }> {
		await this.tokenService.update(user._id, null, "refresh");
		return { message: "Ai fost delogat cu succes" };
	}

	hasData(data: string, salt: number = 8): string {
		return bcrypt.hashSync(data, salt);
	}

	// We refresh accessToken
	async refreshToken(
		userId: string,
		refreshToken: string
	): Promise<IAuthTokens> {
		const user = await this.usersService.findOne({ _id: userId });
		const userRefreshToken = (
			await this.tokenService.findOne({ userId: userId })
		)?.refreshToken;
		if (!user || !userRefreshToken) {
			throw new ForbiddenException("Acces interzis");
		}
		const refreshTokenMatches = await bcrypt.compare(
			refreshToken,
			userRefreshToken
		);
		if (!refreshTokenMatches) throw new ForbiddenException("Acces interzis");
		const tokens = await this.getTokens(
			user._id,
			user.username,
			user.email,
			user.role,
			user.firstName,
			user.lastName
		);
		await this.updateRefreshTokens(user._id, tokens.refreshToken);
		return tokens;
	}

	// get reset token
	async getResetPasswordToken(email: string) {
		const user = await this.usersService.findOne({
			email: {
				$regex: new RegExp("^" + email.toLowerCase() + "$", "i"),
			},
		});
		if (!user) {
			return null;
		}
		const token = await this.getResetToken(user._id, user.email);
		const isTokenInDatabase = await this.tokenService.findOne({
			userId: user._id,
		});
		if (!isTokenInDatabase) {
			await this.tokenService.create({
				userId: user._id,
				resetPasswordToken: token,
			});
		} else {
			await this.updateResetToken(user._id, token);
		}
		return { user: user, token: token };
	}

	// change the password
	async changePassword(
		userId: string,
		password: string,
		changedBy: string
	): Promise<{ message: string } | number> {
		try {
			const isNewPasswordTheSame = await this.checkOldPassword(
				userId,
				password
			);
			if (isNewPasswordTheSame) {
				return 1;
			} else {
				const newPassword = bcrypt.hashSync(password, 8);
				await this.usersService.update(userId, { password: newPassword });
				if (changedBy === "email") {
					await this.destroyResetPasswordToken(userId);
				}
				return { message: "Parola a fost schimbata cu succes" };
			}
		} catch (error) {
			return error;
		}
	}

	// update the refresh token
	async updateRefreshTokens(
		userId: string,
		refreshToken: string
	): Promise<void> {
		const hashedRefreshToken = this.hasData(refreshToken);
		await this.tokenService.update(userId, hashedRefreshToken, "refresh");
	}

	// update only access token
	async updateResetToken(userId: string, resetToken: string): Promise<void> {
		const hashedResetToken = this.hasData(resetToken);
		await this.tokenService.update(userId, hashedResetToken, "reset");
	}

	// destroys the reset token
	async destroyResetPasswordToken(
		userId: string
	): Promise<{ message: string }> {
		await this.tokenService.update(userId, null, "reset");
		return { message: "The reset password token has been destroyed" };
	}

	// check if the new password is different than the old password
	async checkOldPassword(userId: string, password: string): Promise<boolean> {
		try {
			const oldPassword = await this.usersService.findUserPassword({
				_id: userId,
			});
			const passwordValid = bcrypt.compareSync(password, oldPassword);
			return passwordValid;
		} catch (error) {
			return null;
		}
	}

	// generate accessToken and refreshToken
	async getTokens(
		userId: string,
		username: string,
		email: string,
		role: string,
		firstName: string,
		lastName: string
	): Promise<IAuthTokens> {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(
				{
					sub: userId,
					username,
					email,
					role,
					firstName,
					lastName,
				},
				{
					secret: jwtConstants.accessTokenSecret,
					expiresIn: jwtConstants.accessTokenExpirationTime,
				}
			),
			this.jwtService.signAsync(
				{
					sub: userId,
					username,
					email,
					role,
					firstName,
					lastName,
				},
				{
					secret: jwtConstants.refreshTokenSecret,
					expiresIn: jwtConstants.refreshTokenExpirationTime,
				}
			),
		]);
		return {
			accessToken,
			refreshToken,
		};
	}

	// generate the reset token
	async getResetToken(userId: string, email: string): Promise<string> {
		const resetToken = await this.jwtService.signAsync(
			{
				sub: userId,
				email,
			},
			{
				secret: jwtConstants.resetTokenSecret,
				expiresIn: `${jwtConstants.resetTokenExpirationTime}`,
			}
		);
		return resetToken;
	}
}
