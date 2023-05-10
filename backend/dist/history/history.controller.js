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
exports.HistoryController = void 0;
const common_1 = require("@nestjs/common");
const access_token_guard_1 = require("../auth/guards/access-token-guard");
const history_service_1 = require("./history.service");
const mongoose_1 = require("mongoose");
let HistoryController = class HistoryController {
    constructor(historyService) {
        this.historyService = historyService;
        this.ObjectId = mongoose_1.Types.ObjectId;
    }
    async getAllOfInvoice(invoiceId) {
        if (!this.ObjectId.isValid(invoiceId)) {
            throw new common_1.BadRequestException("Id-ul introdus nu este valid");
        }
        const result = await this.historyService.findAllOfInvoice(new this.ObjectId(`${invoiceId}`));
        if (result) {
            return result;
        }
        else {
            throw new common_1.BadRequestException("O eroare neasteptata a avut loc. Te rugam sa inceci din nou");
        }
    }
};
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Get)(":invoiceId"),
    __param(0, (0, common_1.Param)("invoiceId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "getAllOfInvoice", null);
HistoryController = __decorate([
    (0, common_1.Controller)("histories"),
    __metadata("design:paramtypes", [history_service_1.HistoryService])
], HistoryController);
exports.HistoryController = HistoryController;
//# sourceMappingURL=history.controller.js.map