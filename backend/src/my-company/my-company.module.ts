import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/users/schemas/user.schema";
import { UsersService } from "src/users/users.service";
import { VerifyMyCompanyUpdate } from "./midleware/my-company-update.middelware";
import { VerifyMyCompany } from "./midleware/my-company.middleware";
import { MyCompanyController } from "./my-company.controller";
import { MyCompanyService } from "./my-company.service";
import { MyCompany, MyCompanySchema } from "./schemas/my-company.schema";
import { Token, TokenSchema } from "src/token/schemas/token.schema";
import { TokenService } from "src/token/token.service";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: MyCompany.name, schema: MyCompanySchema },
			{ name: User.name, schema: UserSchema },
			{ name: Token.name, schema: TokenSchema },
		]),
	],
	controllers: [MyCompanyController],
	providers: [MyCompanyService, UsersService, TokenService],
	exports: [MyCompanyService],
})
export class MyCompanyModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(VerifyMyCompany)
			.forRoutes({ path: "my-company", method: RequestMethod.POST });
		consumer
			.apply(VerifyMyCompanyUpdate)
			.forRoutes({ path: "my-company/:id", method: RequestMethod.PATCH });
	}
}
