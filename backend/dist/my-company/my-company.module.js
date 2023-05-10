"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyCompanyModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const users_service_1 = require("../users/users.service");
const my_company_update_middelware_1 = require("./midleware/my-company-update.middelware");
const my_company_middleware_1 = require("./midleware/my-company.middleware");
const my_company_controller_1 = require("./my-company.controller");
const my_company_service_1 = require("./my-company.service");
const my_company_schema_1 = require("./schemas/my-company.schema");
const token_schema_1 = require("../token/schemas/token.schema");
const token_service_1 = require("../token/token.service");
let MyCompanyModule = class MyCompanyModule {
    configure(consumer) {
        consumer
            .apply(my_company_middleware_1.VerifyMyCompany)
            .forRoutes({ path: "my-company", method: common_1.RequestMethod.POST });
        consumer
            .apply(my_company_update_middelware_1.VerifyMyCompanyUpdate)
            .forRoutes({ path: "my-company/:id", method: common_1.RequestMethod.PATCH });
    }
};
MyCompanyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: my_company_schema_1.MyCompany.name, schema: my_company_schema_1.MyCompanySchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: token_schema_1.Token.name, schema: token_schema_1.TokenSchema },
            ]),
        ],
        controllers: [my_company_controller_1.MyCompanyController],
        providers: [my_company_service_1.MyCompanyService, users_service_1.UsersService, token_service_1.TokenService],
        exports: [my_company_service_1.MyCompanyService],
    })
], MyCompanyModule);
exports.MyCompanyModule = MyCompanyModule;
//# sourceMappingURL=my-company.module.js.map