import { BadRequestException } from "@nestjs/common";
import { emailRegexpPattern, passwordRegexpPattern } from './regexp-patterns';

const ROLES: string[] = ["user", "admin"];
const emailPattern = emailRegexpPattern;
const passwordPattern = passwordRegexpPattern;

export function checkEmptyInputs(...args: string[]): void {
	for (const arg of args) {
		if (typeof arg !== "number" && !arg) {
			throw new BadRequestException("Te rugam sa completezi toate campurile obligatorii");
		} else if (arg === '' || arg === undefined || arg === null) {
			throw new BadRequestException("Te rugam sa completezi toate campurile obligatorii");
		}
	}
}

// Check role and if not found then set as user
export function checkRole(role: string): string {
	if (!role) {
		return (role = "user");
	} else if (!ROLES.includes(role)) {
		throw new BadRequestException(`Rolul ${role} nu exista!`);
	}
}

export function checkPasswordPattern(password: string): void {
	if (!passwordPattern.test(password)) {
		throw new BadRequestException(
			"Parola trebue sa contina cel putin 8 caractere, macar o litera mica, o litera mare, un numar si un caracter special."
		);
	}
}

export function checkEmailPattern(email: string): void {
	if (!emailPattern.test(email)) {
		throw new BadRequestException("Email invalid!");
	}
}
