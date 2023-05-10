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
exports.VerifyUserUpdate = void 0;
const common_1 = require("@nestjs/common");
const verifyHelper_1 = require("./verifyHelper");
const users_service_1 = require("../users.service");
const shared_middlewares_1 = require("../../utils/shared-middlewares");
let VerifyUserUpdate = class VerifyUserUpdate {
    constructor(verifyHelper, usersServices) {
        this.verifyHelper = verifyHelper;
        this.usersServices = usersServices;
    }
    async use(req, res, next) {
        (0, shared_middlewares_1.checkEmptyInputs)(req.body.username, req.body.email, req.body.firstName, req.body.lastName);
        const user = await this.usersServices.findOne({ _id: req.params.id });
        if (req.body.email) {
            (0, shared_middlewares_1.checkEmailPattern)(req.body.email);
            if (user.email.toLocaleLowerCase() !== req.body.email.toLocaleLowerCase()) {
                await this.verifyHelper.checkDuplicateEmail(req.body.email);
            }
        }
        next();
    }
};
VerifyUserUpdate = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [verifyHelper_1.VerifyHelper,
        users_service_1.UsersService])
], VerifyUserUpdate);
exports.VerifyUserUpdate = VerifyUserUpdate;
//# sourceMappingURL=update-user.middleware.js.map