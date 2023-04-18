import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/users/schemas/user.schema";
import { UsersService } from "src/users/users.service";
import { VerifyUpdateProfilePassword } from "./middleware/update-profile-password.middleware";
import { ProfileController } from "./profile.controller";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
	controllers: [ProfileController],
	providers: [UsersService],
})
export class ProfileModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(VerifyUpdateProfilePassword)
			.forRoutes({
				path: "profile/change-password",
				method: RequestMethod.PATCH,
			});
	}
}
