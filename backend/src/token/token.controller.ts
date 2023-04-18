import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { AccesTokenGuard } from "src/auth/guards/access-token-guard";
import { ITokens } from "./interface/tokens.interface";
import { TokenService } from "./token.service";
import { checkAdminRole } from "src/users/helpers/check-admin-role";

@Controller("tokens")
export class TokenController {
	constructor(private readonly tokenService: TokenService) {}

	@UseGuards(AccesTokenGuard)
	@Get()
	async findAll(@Request() req): Promise<ITokens[]> {
		checkAdminRole(req.user["role"]);
		const tokens = await this.tokenService.findAll();
		if (tokens) {
			return tokens;
		}
	}
}
