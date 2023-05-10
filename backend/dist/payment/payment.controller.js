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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const payment_service_1 = require("./payment.service");
const access_token_guard_1 = require("../auth/guards/access-token-guard");
const dto_1 = require("./dto");
const history_service_1 = require("../history/history.service");
const shared_operators_1 = require("../utils/shared-operators");
const check_admin_role_1 = require("../users/helpers/check-admin-role");
let PaymentController = class PaymentController {
    constructor(paymentService, historyService) {
        this.paymentService = paymentService;
        this.historyService = historyService;
        this.ObjectId = mongoose_1.Types.ObjectId;
    }
    async getAllOfInvoice(invoiceId) {
        return await this.paymentService.findAllOfInvoice(new this.ObjectId(`${invoiceId}`));
    }
    async addPayment(paymentDto, req) {
        const user = req.user;
        const invoiceObjectId = new this.ObjectId(`${paymentDto.invoiceId}`);
        paymentDto.invoiceId = invoiceObjectId;
        const result = await this.paymentService.createAndUpdateInvoicePaymentStatus(paymentDto, invoiceObjectId, user);
        if (result) {
            await this.historyService.create({
                actionDescription: `Plata de ${(0, shared_operators_1.divide)(result.paymentAmount, 100)} RON a fost adaugata`,
                addedBy: user.firstName + " " + user.lastName,
                invoiceId: invoiceObjectId,
            });
        }
        return await this.paymentService.findAllOfInvoice(invoiceObjectId);
    }
    async deletePayment(paymentId, invoiceId, req) {
        const user = req.user;
        (0, check_admin_role_1.checkAdminRole)(user.role);
        const paymentObjectId = new this.ObjectId(`${paymentId}`);
        const invoiceObjectId = new this.ObjectId(`${invoiceId}`);
        const initialPayment = await this.paymentService.findOne(paymentObjectId);
        const result = await this.paymentService.deleteAndUpdateInvoicePaymentStatus(paymentObjectId, invoiceObjectId, user);
        if (result) {
            await this.historyService.create({
                actionDescription: `Plata de ${initialPayment.paymentAmount} RON a fost stearsa`,
                addedBy: user.firstName + " " + user.lastName,
                invoiceId: invoiceObjectId,
            });
        }
        return await this.paymentService.findAllOfInvoice(invoiceObjectId);
    }
};
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Get)(":invoiceId"),
    __param(0, (0, common_1.Param)("invoiceId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getAllOfInvoice", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Post)("add"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreatePaymentDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "addPayment", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Delete)(":paymentId/:invoiceId/delete-payment"),
    __param(0, (0, common_1.Param)("paymentId")),
    __param(1, (0, common_1.Param)("invoiceId")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "deletePayment", null);
PaymentController = __decorate([
    (0, common_1.Controller)("payments"),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        history_service_1.HistoryService])
], PaymentController);
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map