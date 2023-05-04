import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { Payment, PaymentSchema } from "./schemas/payment.schema";
import { Invoice, InvoiceSchema } from "src/invoice/schemas/invoice.schema";
import { Product, ProductSchema } from "src/product/schemas/product.schema";
import {
	HistoryAction,
	HistorySchema,
} from "src/history/schemas/history-model.schema";
import {
	VerifyPaymentCreate,
	VerifyPaymentDelete,
	VerifyPaymentGet,
} from "./middleware";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Payment.name, schema: PaymentSchema },
			{ name: Invoice.name, schema: InvoiceSchema },
			{ name: Product.name, schema: ProductSchema },
			{ name: HistoryAction.name, schema: HistorySchema },
		]),
	],
	controllers: [PaymentController],
	providers: [PaymentService],
	exports: [PaymentService],
})
export class PaymentModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(VerifyPaymentCreate)
			.forRoutes({ path: "payments/add", method: RequestMethod.POST });
		consumer
			.apply(VerifyPaymentGet)
			.forRoutes({ path: "payments/:invoiceId", method: RequestMethod.GET });
		consumer
			.apply(VerifyPaymentDelete)
			.forRoutes({
				path: "payments/:paymentId/:invoiceId/delete-payment",
				method: RequestMethod.DELETE,
			});
	}
}
