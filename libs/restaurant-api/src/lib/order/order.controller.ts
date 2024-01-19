import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	UseGuards
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { Roles } from "../auth/roles.decorator";
import { Role } from "../enums/role.enum";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";

@Controller("order")
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Roles(Role.Admin, Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@Post()
	create(@Body() createOrderDto: CreateOrderDto) {
		return this.orderService.create(createOrderDto);
	}

	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	@Get()
	findAll() {
		return this.orderService.findAll();
	}

	@Roles(Role.Admin, Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@Get(":id")
	getOrderById(orderId: number) {
		return this.orderService.getOrderById(orderId);
	}

	@Roles(Role.Admin, Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@Get("user/:id")
	getOrdersByUserId(userId: number) {
		return this.orderService.getOrdersByUserId(userId);
	}

	@Roles(Role.Admin, Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@Patch(":id")
	update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
		return this.orderService.update(+id, updateOrderDto);
	}
}
