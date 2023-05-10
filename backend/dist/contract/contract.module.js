"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const contract_controller_1 = require("./contract.controller");
const contract_service_1 = require("./contract.service");
const middleware_1 = require("./middleware");
const contract_schema_1 = require("./schemas/contract.schema");
let ContractModule = class ContractModule {
    configure(consumer) {
        consumer
            .apply(middleware_1.VerifyContractCreate)
            .forRoutes({ path: "contracts/add", method: common_1.RequestMethod.POST });
        consumer.apply(middleware_1.VerifyContractUpdate).forRoutes({
            path: "contracts/:id/edit-contract",
            method: common_1.RequestMethod.PATCH,
        });
    }
};
ContractModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: contract_schema_1.Contract.name, schema: contract_schema_1.ContractSchema },
            ]),
        ],
        controllers: [contract_controller_1.ContractController],
        providers: [contract_service_1.ContractService],
        exports: [contract_service_1.ContractService],
    })
], ContractModule);
exports.ContractModule = ContractModule;
//# sourceMappingURL=contract.module.js.map