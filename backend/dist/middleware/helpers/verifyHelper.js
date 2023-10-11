"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyHelper = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../users/users.service");
let VerifyHelper = class VerifyHelper {
    constructor(userService) {
        this.userService = userService;
        this.ROLES = ["user", "admin"];
        this.emailPattern = /[a-z0-9\-_.0]+@[a-z0-9\-_.]+\.[a-z]{2,}/i;
        this.passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&\^\(\)])[A-Za-z\d@#$!%*?&\^\(\)\.]{8,}$/;
    }
    checkEmptyInputs(...args) {
        for (const arg of args) {
            if (!arg) {
                throw new common_1.BadRequestException("Te rugam sa completezi toate campurile obligatorii!");
            }
        }
    }
    checkRole(role) {
        if (!role) {
            return (role = "user");
        }
        else if (!this.ROLES.includes(role)) {
            throw new common_1.BadRequestException(`Rolul ${role} nu exista!`);
        }
    }
    checkPasswordPattern(password) {
        if (!this.passwordPattern.test(password)) {
            throw new common_1.BadRequestException("Parola trebue sa contina cel putin 8 caractere, macar o litera mica, o litera mare, un numar si un caracter special.");
        }
    }
    checkEmailPattern(email) {
        if (!this.emailPattern.test(email)) {
            throw new common_1.BadRequestException("Email invalid!");
        }
    }
    async checkDuplicateEmail(email) {
        const user = await this.userService.findOne({
            email: {
                $regex: new RegExp("^" + email.toLowerCase() + "$", "i"),
            },
        });
        if (user) {
            throw new common_1.BadRequestException("Emailul este deja in folosinta!");
        }
    }
};
VerifyHelper = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], VerifyHelper);
exports.VerifyHelper = VerifyHelper;
//# sourceMappingURL=verifyHelper.js.map