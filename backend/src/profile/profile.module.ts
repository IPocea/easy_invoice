import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/users/schemas/user.schema";
import { UsersService } from "src/users/users.service";
import { VerifyUpdateProfilePassword } from "./middleware/update-profile-password.middleware";
import { ProfileController } from "./profile.controller";
import { Token, TokenSchema } from "src/token/schemas/token.schema";
import { TokenService } from "src/token/token.service";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Token.name, schema: TokenSchema },
		]),
	],
	controllers: [ProfileController],
	providers: [UsersService, TokenService],
})
export class ProfileModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(VerifyUpdateProfilePassword).forRoutes({
			path: "profile/change-password",
			method: RequestMethod.PATCH,
		});
	}
}
