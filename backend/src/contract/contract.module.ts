import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ContractController } from "./contract.controller";
import { ContractService } from "./contract.service";
import { VerifyContractCreate, VerifyContractUpdate } from "./middleware";
import { Contract, ContractSchema } from "./schemas/contract.schema";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Contract.name, schema: ContractSchema },
		]),
	],
	controllers: [ContractController],
	providers: [ContractService],
	exports: [ContractService],
})
export class ContractModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(VerifyContractCreate)
			.forRoutes({ path: "contracts/add", method: RequestMethod.POST });
		consumer.apply(VerifyContractUpdate).forRoutes({
			path: "contracts/:id/edit-contract",
			method: RequestMethod.PATCH,
		});
	}
}
