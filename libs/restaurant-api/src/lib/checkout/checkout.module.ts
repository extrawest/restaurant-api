import { Module } from "@nestjs/common";
import { CheckoutService } from "./checkout.service";
import { CheckoutController } from "./checkout.controller";
import { AuthModule } from "../auth/auth.module";
import { CartModule } from "../cart/cart.module";
import { QueuesModule } from "../queues/queues.module";
import { PaymentModule } from "../payment/payment.module";
import { OrderModule } from "../order/order.module";
import { UsersModule } from "../user/user.module";

@Module({
	imports: [
		AuthModule,
		CartModule,
		QueuesModule,
		PaymentModule,
		OrderModule,
		UsersModule,
	],
	controllers: [CheckoutController],
	providers: [CheckoutService],
})
export class CheckoutModule {}
