import { Module } from "@nestjs/common";
import { CheckoutService } from "./checkout.service";
import { CheckoutController } from "./checkout.controller";
import { AuthModule } from "../auth/auth.module";
import { CartModule } from "../cart/cart.module";
import { QueuesModule } from "../queues/queues.module";
import { PaymentModule } from "../payment/payment.module";

@Module({
	imports: [
		AuthModule,
		CartModule,
		QueuesModule,
		PaymentModule,
	],
	controllers: [CheckoutController],
	providers: [CheckoutService],
})
export class CheckoutModule {}
