"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const seller_schema_1 = require("./schemas/seller.schema");
const seller_controller_1 = require("./seller.controller");
const seller_service_1 = require("./seller.service");
let SellerModule = class SellerModule {
};
SellerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: seller_schema_1.Seller.name, schema: seller_schema_1.SellerSchema }]),
        ],
        controllers: [seller_controller_1.SellerController],
        providers: [seller_service_1.SellerService],
        exports: [seller_service_1.SellerService],
    })
], SellerModule);
exports.SellerModule = SellerModule;
//# sourceMappingURL=seller.module.js.map