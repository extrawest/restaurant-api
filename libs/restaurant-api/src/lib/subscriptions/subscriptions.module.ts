import { Module } from "@nestjs/common";
import { StripeModule } from "../stripe/stripe.module";
import { SubscriptionsService } from "./subscriptions.service";
import { SubscriptionsController } from "./subscriptions.controller";

@Module({
	imports: [StripeModule],
	controllers: [SubscriptionsController],
	providers: [SubscriptionsService],
	exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
