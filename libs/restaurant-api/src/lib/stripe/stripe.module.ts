import { Module, forwardRef } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { AuthModule } from "../auth/auth.module";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [forwardRef(() => AuthModule), ConfigModule],
	providers: [StripeService],
	exports: [StripeService]
})
export class StripeModule {}
