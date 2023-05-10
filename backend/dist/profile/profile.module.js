"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const users_service_1 = require("../users/users.service");
const update_profile_password_middleware_1 = require("./middleware/update-profile-password.middleware");
const profile_controller_1 = require("./profile.controller");
const token_schema_1 = require("../token/schemas/token.schema");
const token_service_1 = require("../token/token.service");
let ProfileModule = class ProfileModule {
    configure(consumer) {
        consumer.apply(update_profile_password_middleware_1.VerifyUpdateProfilePassword).forRoutes({
            path: "profile/change-password",
            method: common_1.RequestMethod.PATCH,
        });
    }
};
ProfileModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: token_schema_1.Token.name, schema: token_schema_1.TokenSchema },
            ]),
        ],
        controllers: [profile_controller_1.ProfileController],
        providers: [users_service_1.UsersService, token_service_1.TokenService],
    })
], ProfileModule);
exports.ProfileModule = ProfileModule;
//# sourceMappingURL=profile.module.js.map