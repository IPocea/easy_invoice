"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractModelModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const contract_model_controller_1 = require("./contract-model.controller");
const contract_model_service_1 = require("./contract-model.service");
const middleware_1 = require("./middleware");
const contract_model_schema_1 = require("./schemas/contract-model.schema");
let ContractModelModule = class ContractModelModule {
    configure(consumer) {
        consumer
            .apply(middleware_1.VerifyContractModelCreate)
            .forRoutes({ path: "contract-models/add", method: common_1.RequestMethod.POST });
        consumer.apply(middleware_1.VerifyContractModelUpdate).forRoutes({
            path: "contract-models/:id/edit-contract-model",
            method: common_1.RequestMethod.PATCH,
        });
    }
};
ContractModelModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: contract_model_schema_1.ContractModel.name, schema: contract_model_schema_1.ContractModelSchema },
            ]),
        ],
        controllers: [contract_model_controller_1.ContractModelController],
        providers: [contract_model_service_1.ContractModelService],
        exports: [contract_model_service_1.ContractModelService],
    })
], ContractModelModule);
exports.ContractModelModule = ContractModelModule;
//# sourceMappingURL=contract-model.module.js.map