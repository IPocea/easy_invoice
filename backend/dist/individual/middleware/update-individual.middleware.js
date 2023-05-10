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
exports.VerifyIndividualUpdate = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const shared_middlewares_1 = require("../../utils/shared-middlewares");
const individual_service_1 = require("../individual.service");
let VerifyIndividualUpdate = class VerifyIndividualUpdate {
    constructor(individualService) {
        this.individualService = individualService;
    }
    async use(req, res, next) {
        (0, shared_middlewares_1.checkEmptyInputs)(req.body.name, req.body.series, req.body.CNP, req.body.headquarters, req.body.county);
        const ObjectId = mongoose_1.default.Types.ObjectId;
        const individual = await this.individualService.findOne({
            _id: new ObjectId(`${req.params.id}`),
        });
        if (individual.CNP !== req.body.CNP) {
            const duplicate = await this.individualService.findOne({
                CNP: {
                    $regex: new RegExp("^" + req.body.CNP.toLowerCase() + "$", "i"),
                },
            });
            if (duplicate) {
                throw new common_1.BadRequestException(`CNP-ul ${req.body.CNP} este deja in folosinta!`);
            }
        }
        next();
    }
};
VerifyIndividualUpdate = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [individual_service_1.IndividualService])
], VerifyIndividualUpdate);
exports.VerifyIndividualUpdate = VerifyIndividualUpdate;
//# sourceMappingURL=update-individual.middleware.js.map