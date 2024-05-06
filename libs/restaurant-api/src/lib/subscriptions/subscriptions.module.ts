import { Module, forwardRef } from "@nestjs/common";
import { UsersModule } from "../user/user.module";
import { StripeModule } from "../stripe/stripe.module";
import { PaymentModule } from "../payment/payment.module";
import { SubscriptionsService } from "./subscriptions.service";
import { SubscriptionsController } from "./subscriptions.controller";
import { PaymentProductsService } from "./payment-products.service";
import { PricesService } from "./prices.service";
import { subscriptionProviders } from "./subscriptions.providers";

@Module({
	imports: [
		forwardRef(() => PaymentModule),
		forwardRef(() => StripeModule),
		forwardRef(() => UsersModule),
	],
	controllers: [SubscriptionsController],
	providers: [SubscriptionsService, PaymentProductsService, PricesService, ...subscriptionProviders],
	exports: [SubscriptionsService, PaymentProductsService, PricesService],
})
export class SubscriptionsModule {}
