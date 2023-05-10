"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndividualModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const individual_controller_1 = require("./individual.controller");
const individual_service_1 = require("./individual.service");
const middleware_1 = require("./middleware");
const individual_schema_1 = require("./schemas/individual.schema");
let IndividualModule = class IndividualModule {
    configure(consumer) {
        consumer
            .apply(middleware_1.VerifyIndividualCreate)
            .forRoutes({ path: "individuals/add", method: common_1.RequestMethod.POST });
        consumer
            .apply(middleware_1.VerifyIndividualCreate)
            .forRoutes({
            path: "individuals/add-and-return-individual",
            method: common_1.RequestMethod.POST,
        });
        consumer.apply(middleware_1.VerifyIndividualUpdate).forRoutes({
            path: "individuals/:id/edit-company",
            method: common_1.RequestMethod.PATCH,
        });
    }
};
IndividualModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: individual_schema_1.Individual.name, schema: individual_schema_1.IndividualSchema },
            ]),
        ],
        controllers: [individual_controller_1.IndividualController],
        providers: [individual_service_1.IndividualService],
        exports: [individual_service_1.IndividualService],
    })
], IndividualModule);
exports.IndividualModule = IndividualModule;
//# sourceMappingURL=individual.module.js.map