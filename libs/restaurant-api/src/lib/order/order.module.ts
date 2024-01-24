import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { ordersProviders } from "./order.providers";
import { CartModule } from "../cart/cart.module";
import { OrderController } from "./order.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
	imports: [CartModule, AuthModule],
	providers: [OrderService, ...ordersProviders],
	controllers: [OrderController],
	exports: [OrderService]
})
export class OrderModule {}
