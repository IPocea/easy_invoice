"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const auth_middleware_1 = require("./middleware/auth.middleware");
const user_schema_1 = require("../users/schemas/user.schema");
const users_module_1 = require("../users/users.module");
const users_service_1 = require("../users/users.service");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const local_strategy_1 = require("./strategies/local.strategy");
const access_token_strategy_1 = require("./strategies/access-token.strategy");
const refresh_token_strategy_1 = require("./strategies/refresh-token.strategy");
const token_service_1 = require("../token/token.service");
const token_module_1 = require("../token/token.module");
const token_schema_1 = require("../token/schemas/token.schema");
const reset_token_strategy_1 = require("./strategies/reset-token.strategy");
let AuthModule = class AuthModule {
    configure(consumer) {
        consumer
            .apply(auth_middleware_1.AuthMiddleware)
            .forRoutes({ path: "auth/login", method: common_1.RequestMethod.POST });
    }
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            token_module_1.TokenModule,
            users_module_1.UsersModule,
            passport_1.PassportModule,
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: token_schema_1.Token.name, schema: token_schema_1.TokenSchema },
            ]),
            jwt_1.JwtModule.register({}),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            users_service_1.UsersService,
            auth_service_1.AuthService,
            local_strategy_1.LocalStrategy,
            access_token_strategy_1.AccessTokenStrategy,
            refresh_token_strategy_1.RefreshTokenStrategy,
            reset_token_strategy_1.ResetTokenStrategy,
            token_service_1.TokenService,
        ],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map