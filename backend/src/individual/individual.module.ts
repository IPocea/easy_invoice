import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { IndividualController } from "./individual.controller";
import { IndividualService } from "./individual.service";
import { VerifyIndividualCreate, VerifyIndividualUpdate } from "./middleware";
import { Individual, IndividualSchema } from "./schemas/individual.schema";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Individual.name, schema: IndividualSchema },
		]),
	],
	controllers: [IndividualController],
	providers: [IndividualService],
	exports: [IndividualService],
})
export class IndividualModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(VerifyIndividualCreate)
			.forRoutes({ path: "individuals/add", method: RequestMethod.POST });
		consumer
			.apply(VerifyIndividualCreate)
			.forRoutes({
				path: "individuals/add-and-return-individual",
				method: RequestMethod.POST,
			});
		consumer.apply(VerifyIndividualUpdate).forRoutes({
			path: "individuals/:id/edit-company",
			method: RequestMethod.PATCH,
		});
	}
}
