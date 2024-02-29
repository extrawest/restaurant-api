import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { StripeModule } from "../stripe/stripe.module";
import { paymentProviders } from "./payment.providers";

@Module({
	imports: [StripeModule],
	controllers: [PaymentController],
	providers: [PaymentService, ...paymentProviders],
})
export class PaymentModule {}
