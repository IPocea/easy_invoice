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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const payment_schema_1 = require("./schemas/payment.schema");
const shared_operators_1 = require("../utils/shared-operators");
const utils_1 = require("./utils");
const invoice_schema_1 = require("../invoice/schemas/invoice.schema");
let PaymentService = class PaymentService {
    constructor(paymentModel, invoiceModel) {
        this.paymentModel = paymentModel;
        this.invoiceModel = invoiceModel;
        this.ObjectId = mongoose_2.default.Types.ObjectId;
    }
    async findAllOfInvoice(invoiceId) {
        try {
            const aggrArray = (0, utils_1.getAllOfInvoiceAggArray)(invoiceId);
            return await this.paymentModel.aggregate(aggrArray);
        }
        catch (error) {
            return null;
        }
    }
    async create(newPayment) {
        try {
            newPayment.paymentAmount = (0, shared_operators_1.multiply)(newPayment.paymentAmount, 100);
            const createdPayment = new this.paymentModel(newPayment);
            return await createdPayment.save();
        }
        catch (error) {
            return null;
        }
    }
    async createAndUpdateInvoicePaymentStatus(newPayment, invoiceId, user) {
        try {
            const aggArray = (0, utils_1.getInvoiceFromPaymentsController)(invoiceId);
            const payment = await this.create(newPayment);
            if (payment) {
                const invoiceResult = await this.invoiceModel.aggregate(aggArray);
                const invoice = invoiceResult[0];
                if (invoice) {
                    const paymentStatus = invoice.totalPayments >= invoice.totalCost ? true : false;
                    await this.invoiceModel.findOneAndUpdate({ _id: invoiceId }, {
                        paymentStatus: paymentStatus,
                        editedBy: user.firstName + " " + user.lastName,
                    }, { new: true });
                }
            }
            return payment;
        }
        catch (error) {
            return null;
        }
    }
    async findOne(paymentId) {
        try {
            const aggrArray = (0, utils_1.getOneByIdAggArray)(paymentId);
            const paymentArray = await this.paymentModel.aggregate(aggrArray);
            return paymentArray[0];
        }
        catch (error) {
            return null;
        }
    }
    async deleteOne(paymentId) {
        try {
            await this.paymentModel.deleteOne({
                _id: paymentId,
            });
            return {
                message: `Plata cu id-ul ${paymentId.toString()} a fost sters`,
            };
        }
        catch (error) {
            return null;
        }
    }
    async deleteAndUpdateInvoicePaymentStatus(paymentId, invoiceId, user) {
        try {
            const aggArray = (0, utils_1.getInvoiceFromPaymentsController)(invoiceId);
            const deleteResult = await this.deleteOne(paymentId);
            if (deleteResult) {
                const invoiceResult = await this.invoiceModel.aggregate(aggArray);
                const invoice = invoiceResult[0];
                if (invoice) {
                    const paymentStatus = invoice.totalPayments >= invoice.totalCost ? true : false;
                    await this.invoiceModel.findOneAndUpdate({ _id: invoiceId }, {
                        paymentStatus: paymentStatus,
                        editedBy: user.firstName + " " + user.lastName,
                    }, { new: true });
                }
                return { message: "Plata a fost stearsa cu succes" };
            }
            else {
                return null;
            }
        }
        catch (error) {
            return null;
        }
    }
    async deleteManyByInvoiceId(invoiceId) {
        try {
            const result = await this.paymentModel.deleteMany({
                invoiceId: invoiceId,
            });
            if (result) {
                return {
                    message: `Platile pentru factura cu id-ul ${invoiceId.toString()} au fost sterse`,
                };
            }
        }
        catch (error) {
            return null;
        }
    }
    async deleteMany(query) {
        try {
            const result = await this.paymentModel.deleteMany(query);
            if (result) {
                return {
                    message: `Platile pentru factura selectata au fost sterse`,
                };
            }
        }
        catch (error) {
            return null;
        }
    }
};
PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __param(1, (0, mongoose_1.InjectModel)(invoice_schema_1.Invoice.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map