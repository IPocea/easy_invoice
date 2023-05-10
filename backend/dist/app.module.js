"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const token_module_1 = require("./token/token.module");
const auth_module_1 = require("./auth/auth.module");
const my_company_module_1 = require("./my-company/my-company.module");
const profile_module_1 = require("./profile/profile.module");
const mail_module_1 = require("./mail/mail.module");
const company_module_1 = require("./companies/company.module");
const invoice_module_1 = require("./invoice/invoice.module");
const payment_module_1 = require("./payment/payment.module");
const individual_module_1 = require("./individual/individual.module");
const contract_module_1 = require("./contract/contract.module");
const product_module_1 = require("./product/product.module");
const buyer_module_1 = require("./buyer/buyer.module");
const seller_module_1 = require("./seller/seller.module");
const contract_model_module_1 = require("./contract-model/contract-model.module");
const history_module_1 = require("./history/history.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            token_module_1.TokenModule,
            auth_module_1.AuthModule,
            profile_module_1.ProfileModule,
            my_company_module_1.MyCompanyModule,
            company_module_1.CompanyModule,
            individual_module_1.IndividualModule,
            invoice_module_1.InvoiceModule,
            contract_module_1.ContractModule,
            payment_module_1.PaymentModule,
            product_module_1.ProductModule,
            buyer_module_1.BuyerModule,
            seller_module_1.SellerModule,
            mail_module_1.MailModule,
            history_module_1.HistoryModule,
            contract_model_module_1.ContractModelModule,
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (config) => ({
                    uri: config.get("mongoDB"),
                }),
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map