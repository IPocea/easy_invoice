"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const payment_controller_1 = require("./payment.controller");
const payment_service_1 = require("./payment.service");
const payment_schema_1 = require("./schemas/payment.schema");
const invoice_schema_1 = require("../invoice/schemas/invoice.schema");
const product_schema_1 = require("../product/schemas/product.schema");
const history_model_schema_1 = require("../history/schemas/history-model.schema");
const middleware_1 = require("./middleware");
let PaymentModule = class PaymentModule {
    configure(consumer) {
        consumer
            .apply(middleware_1.VerifyPaymentCreate)
            .forRoutes({ path: "payments/add", method: common_1.RequestMethod.POST });
        consumer
            .apply(middleware_1.VerifyPaymentGet)
            .forRoutes({ path: "payments/:invoiceId", method: common_1.RequestMethod.GET });
        consumer
            .apply(middleware_1.VerifyPaymentDelete)
            .forRoutes({
            path: "payments/:paymentId/:invoiceId/delete-payment",
            method: common_1.RequestMethod.DELETE,
        });
    }
};
PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: payment_schema_1.Payment.name, schema: payment_schema_1.PaymentSchema },
                { name: invoice_schema_1.Invoice.name, schema: invoice_schema_1.InvoiceSchema },
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                { name: history_model_schema_1.HistoryAction.name, schema: history_model_schema_1.HistorySchema },
            ]),
        ],
        controllers: [payment_controller_1.PaymentController],
        providers: [payment_service_1.PaymentService],
        exports: [payment_service_1.PaymentService],
    })
], PaymentModule);
exports.PaymentModule = PaymentModule;
//# sourceMappingURL=payment.module.js.map