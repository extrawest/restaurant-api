import { ConfigModule } from "@nestjs/config";
import { Module, forwardRef } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { AuthModule } from "../auth/auth.module";
import StripeWebhookController from "./stripe-webhook";
import { PaymentModule } from "../payment/payment.module";

@Module({
	imports: [
		forwardRef(() => AuthModule),
		forwardRef(() => PaymentModule),
		ConfigModule, 
	],
	controllers: [StripeWebhookController],
	providers: [StripeService],
	exports: [StripeService]
})
export class StripeModule {}
