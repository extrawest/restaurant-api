import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { ordersProviders } from "./order.providers";
import { CartModule } from "../cart/cart.module";
import { OrderController } from "./order.controller";

@Module({
	imports: [CartModule],
	providers: [OrderService, ...ordersProviders],
	controllers: [OrderController]
})
export class OrderModule {}
