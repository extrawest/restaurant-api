import { ConfigModule } from "@nestjs/config";
import { Module, forwardRef } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { AuthModule } from "../auth/auth.module";
import StripeWebhookController from "./stripe-webhook";
import { PaymentModule } from "../payment/payment.module";
import { SubscriptionsModule } from "../subscriptions/subscriptions.module";
import { UsersModule } from "../user/user.module";

@Module({
	imports: [
		forwardRef(() => AuthModule),
		forwardRef(() => PaymentModule),
		forwardRef(() => SubscriptionsModule),
		forwardRef(() => UsersModule),
		ConfigModule, 
	],
	controllers: [StripeWebhookController],
	providers: [StripeService],
	exports: [StripeService]
})
export class StripeModule {}
