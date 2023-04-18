import { UnauthorizedException } from "@nestjs/common";

export function checkAdminRole(role: string): void {
	if (role !== "admin")
		throw new UnauthorizedException("Necesita rol de admin");
}
