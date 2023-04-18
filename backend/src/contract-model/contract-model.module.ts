import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ContractModelController } from "./contract-model.controller";
import { ContractModelService } from "./contract-model.service";
import {
	VerifyContractModelCreate,
	VerifyContractModelUpdate,
} from "./middleware";
import {
	ContractModel,
	ContractModelSchema,
} from "./schemas/contract-model.schema";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: ContractModel.name, schema: ContractModelSchema },
		]),
	],
	controllers: [ContractModelController],
	providers: [ContractModelService],
	exports: [ContractModelService],
})
export class ContractModelModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(VerifyContractModelCreate)
			.forRoutes({ path: "contract-models/add", method: RequestMethod.POST });
		consumer.apply(VerifyContractModelUpdate).forRoutes({
			path: "contract-models/:id/edit-contract-model",
			method: RequestMethod.PATCH,
		});
	}
}
