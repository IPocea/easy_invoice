import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { VerifyHelper } from "src/users/middleware/verifyHelper";
import { VerifyModify } from "src/users/middleware/verifyModify.middleware";
import { VerifySignup } from "src/users/middleware/verifySignup.middleware";
import { changePasswordMiddleware } from "./middleware/change-password.middleware";
import { VerifyUserUpdate } from "./middleware/update-user.middleware";
import { User, UserSchema } from "./schemas/user.schema";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { Token, TokenSchema } from "src/token/schemas/token.schema";
import { TokenService } from "src/token/token.service";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Token.name, schema: TokenSchema },
		]),
	],
	controllers: [UsersController],
	providers: [UsersService, VerifyHelper, TokenService],
})
export class UsersModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(VerifySignup)
			.forRoutes({ path: "users/add", method: RequestMethod.POST });
		consumer
			.apply(VerifyModify)
			.forRoutes({ path: "users/:id", method: RequestMethod.PATCH });
		consumer.apply(changePasswordMiddleware).forRoutes({
			path: "users/change-password/:id",
			method: RequestMethod.PATCH,
		});
		consumer
			.apply(VerifyUserUpdate)
			.forRoutes({ path: "users/:id/edit-user", method: RequestMethod.PATCH });
	}
}
