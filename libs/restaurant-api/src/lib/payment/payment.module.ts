import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { StripeModule } from "../stripe/stripe.module";
import { paymentProviders } from "./payment.providers";
import { OrderModule } from "../order/order.module";

@Module({
	imports: [
		forwardRef(() => StripeModule),
		OrderModule,
		JwtModule,
	],
	controllers: [PaymentController],
	providers: [PaymentService, ...paymentProviders],
	exports: [PaymentService]
})
export class PaymentModule {}
