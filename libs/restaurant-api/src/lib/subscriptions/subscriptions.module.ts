import { Module } from "@nestjs/common";
import { UsersModule } from "../user/user.module";
import { StripeModule } from "../stripe/stripe.module";
import { PaymentModule } from "../payment/payment.module";
import { SubscriptionsService } from "./subscriptions.service";
import { SubscriptionsController } from "./subscriptions.controller";

@Module({
	imports: [StripeModule, UsersModule, PaymentModule],
	controllers: [SubscriptionsController],
	providers: [SubscriptionsService],
	exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
