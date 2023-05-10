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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const history_model_schema_1 = require("./schemas/history-model.schema");
let HistoryService = class HistoryService {
    constructor(historyModel) {
        this.historyModel = historyModel;
    }
    async create(newAction) {
        try {
            const createdAction = new this.historyModel(newAction);
            return await createdAction.save();
        }
        catch (error) {
            return null;
        }
    }
    async findOne(query) {
        try {
            const action = await this.historyModel.findOne(query);
            return action;
        }
        catch (error) {
            return null;
        }
    }
    async findAllOfInvoice(invoiceId) {
        try {
            return await this.historyModel
                .find({ invoiceId: invoiceId })
                .sort({ createdAt: -1 });
        }
        catch (error) {
            return null;
        }
    }
    async deleteManyByInvoiceId(invoiceId) {
        try {
            const result = await this.historyModel.deleteMany({
                invoiceId: invoiceId,
            });
            if (result) {
                return {
                    message: `Istoricul pentru factura cu id-ul ${invoiceId.toString()} a fost sters`,
                };
            }
        }
        catch (error) {
            return null;
        }
    }
    async deleteMany(query) {
        try {
            const result = await this.historyModel.deleteMany(query);
            if (result) {
                return {
                    message: `Istoricul pentru factura selectata a fost sters`,
                };
            }
        }
        catch (error) {
            return null;
        }
    }
};
HistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(history_model_schema_1.HistoryAction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], HistoryService);
exports.HistoryService = HistoryService;
//# sourceMappingURL=history.service.js.map