import { Module } from "@nestjs/common";
import { UsersModule } from "../user/user.module";
import { StripeModule } from "../stripe/stripe.module";
import { PaymentModule } from "../payment/payment.module";
import { SubscriptionsService } from "./subscriptions.service";
import { SubscriptionsController } from "./subscriptions.controller";
import { PaymentProductsService } from "./payment-products.service";
import { PricesService } from "./prices.service";

@Module({
	imports: [StripeModule, UsersModule, PaymentModule],
	controllers: [SubscriptionsController],
	providers: [SubscriptionsService, PaymentProductsService, PricesService],
	exports: [SubscriptionsService, PaymentProductsService, PricesService],
})
export class SubscriptionsModule {}
