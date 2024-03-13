import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { StripeModule } from "../stripe/stripe.module";
import { paymentProviders } from "./payment.providers";
import { OrderModule } from "../order/order.module";

@Module({
	imports: [StripeModule, OrderModule],
	controllers: [PaymentController],
	providers: [PaymentService, ...paymentProviders],
})
export class PaymentModule {}
