import { Module, forwardRef } from "@nestjs/common";
import { UsersService } from "./user.service";
import { usersProviders } from "./user.providers";
import { UsersController } from "./user.controller";
import { AuthModule } from "../auth/auth.module";
import { StripeModule } from "../stripe/stripe.module";

@Module({
	imports: [forwardRef(() => AuthModule), StripeModule],
	controllers: [UsersController],
	providers: [UsersService, ...usersProviders],
	exports: [UsersService]
})
export class UsersModule {}
