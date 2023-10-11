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
exports.VerifySignup = void 0;
const common_1 = require("@nestjs/common");
const verifyHelper_1 = require("./helpers/verifyHelper");
let VerifySignup = class VerifySignup {
    constructor(verifyHelper) {
        this.verifyHelper = verifyHelper;
    }
    async use(req, res, next) {
        this.verifyHelper.checkEmptyInputs(req.body.username, req.body.password, req.body.email);
        if (!req.body.role) {
            req.body.role = this.verifyHelper.checkRole(req.body.role);
        }
        this.verifyHelper.checkPasswordPattern(req.body.password);
        this.verifyHelper.checkEmailPattern(req.body.email);
        await this.verifyHelper.checkDuplicateEmail(req.body.email);
        next();
    }
};
VerifySignup = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [verifyHelper_1.VerifyHelper])
], VerifySignup);
exports.VerifySignup = VerifySignup;
//# sourceMappingURL=verifySignup.middleware.js.map