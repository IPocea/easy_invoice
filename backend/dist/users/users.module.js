"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const verifyHelper_1 = require("./middleware/verifyHelper");
const verifyModify_middleware_1 = require("./middleware/verifyModify.middleware");
const verifySignup_middleware_1 = require("./middleware/verifySignup.middleware");
const change_password_middleware_1 = require("./middleware/change-password.middleware");
const update_user_middleware_1 = require("./middleware/update-user.middleware");
const user_schema_1 = require("./schemas/user.schema");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
const token_schema_1 = require("../token/schemas/token.schema");
const token_service_1 = require("../token/token.service");
let UsersModule = class UsersModule {
    configure(consumer) {
        consumer
            .apply(verifySignup_middleware_1.VerifySignup)
            .forRoutes({ path: "users/add", method: common_1.RequestMethod.POST });
        consumer
            .apply(verifyModify_middleware_1.VerifyModify)
            .forRoutes({ path: "users/:id", method: common_1.RequestMethod.PATCH });
        consumer.apply(change_password_middleware_1.changePasswordMiddleware).forRoutes({
            path: "users/change-password/:id",
            method: common_1.RequestMethod.PATCH,
        });
        consumer
            .apply(update_user_middleware_1.VerifyUserUpdate)
            .forRoutes({ path: "users/:id/edit-user", method: common_1.RequestMethod.PATCH });
    }
};
UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: token_schema_1.Token.name, schema: token_schema_1.TokenSchema },
            ]),
        ],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService, verifyHelper_1.VerifyHelper, token_service_1.TokenService],
    })
], UsersModule);
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map