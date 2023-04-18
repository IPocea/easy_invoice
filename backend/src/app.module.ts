import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { TokenModule } from "./token/token.module";
import { AuthModule } from "./auth/auth.module";
import { MyCompanyModule } from "./my-company/my-company.module";
import { ProfileModule } from "./profile/profile.module";
import { MailModule } from "./mail/mail.module";
import { CompanyModule } from "./companies/company.module";
import { InvoiceModule } from "./invoice/invoice.module";
import { PaymentModule } from "./payment/payment.module";
import { IndividualModule } from "./individual/individual.module";
import { ContractModule } from "./contract/contract.module";
import { ProductModule } from "./product/product.module";
import { BuyerModule } from "./buyer/buyer.module";
import { SellerModule } from "./seller/seller.module";
import { ContractModelModule } from "./contract-model/contract-model.module";
import { HistoryModule } from "./history/history.module";

@Module({
	imports: [
		UsersModule,
		TokenModule,
		AuthModule,
		ProfileModule,
		MyCompanyModule,
		CompanyModule,
		IndividualModule,
		InvoiceModule,
		ContractModule,
		PaymentModule,
		ProductModule,
		BuyerModule,
		SellerModule,
		MailModule,
		HistoryModule,
		ContractModelModule,
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				uri: config.get<string>("mongoDB"), // Loaded from .ENV
			}),
		}),
		ConfigModule.forRoot({
			isGlobal: true,
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
