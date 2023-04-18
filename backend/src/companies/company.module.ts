import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { VerifyCompany, VerifyCompanyUpdate } from "./middleware";
import { Company, CompanySchema } from "./schemas/company.schema";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
	],
	controllers: [CompanyController],
	providers: [CompanyService],
	exports: [CompanyService],
})
export class CompanyModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(VerifyCompany)
			.forRoutes({ path: "companies/add", method: RequestMethod.POST });
		consumer
			.apply(VerifyCompany)
			.forRoutes({
				path: "companies/add-and-return-company",
				method: RequestMethod.POST,
			});
		consumer.apply(VerifyCompanyUpdate).forRoutes({
			path: "companies/:id/edit-company",
			method: RequestMethod.PATCH,
		});
	}
}
