import { ConfigModule } from "@nestjs/config";
import { Module, forwardRef } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { AuthModule } from "../auth/auth.module";
import StripeWebhookController from "./stripe-webhook";
import { PaymentModule } from "../payment/payment.module";
import { PricesService } from "../subscriptions/prices.service";
import { SubscriptionsService } from "../subscriptions/subscriptions.service";
import { PaymentProductsService } from "../subscriptions/payment-products.service";

@Module({
	imports: [
		forwardRef(() => AuthModule),
		forwardRef(() => PaymentModule),
		forwardRef(() => SubscriptionsService),
		forwardRef(() => PaymentProductsService),
		forwardRef(() => PricesService),
		ConfigModule, 
	],
	controllers: [StripeWebhookController],
	providers: [StripeService],
	exports: [StripeService]
})
export class StripeModule {}
