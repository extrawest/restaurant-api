import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { Roles } from "../auth/roles.decorator";
import { Role } from "../enums/role.enum";
import { AuthGuard } from "../auth/guards/auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { StatisticsFields } from "../enums/order.enum";
import { OrderDTO } from "./dto/order.dto";
import { Maybe } from "utils";

@Controller("order")
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Roles(Role.Admin, Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@Post()
	create(@Body() createOrderDto: CreateOrderDto): Promise<OrderDTO | Error> {
		return this.orderService.create(createOrderDto);
	}

	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	@Get()
	findAll(@Query("fromDate") fromDate?: string, @Query("toDate") toDate?: string): Promise<OrderDTO[]>  {
		return this.orderService.findAll(fromDate, toDate);
	}

	@Roles(Role.Admin, Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@Get(":id")
	getOrderById(orderId: number): Promise<Maybe<OrderDTO>> | Error  {
		return this.orderService.getOrderById(orderId);
	}

	@Roles(Role.Admin, Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@Get("user/:id")
	getOrdersByUserId(userId: number): Promise<OrderDTO[]> {
		return this.orderService.getOrdersByUserId(userId);
	}

	@Roles(Role.Admin, Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@Patch(":id")
	update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<OrderDTO> {
		return this.orderService.update(+id, updateOrderDto);
	}

	// TODO: create service for statistics to cover more cases, not only orders
	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	@Get("statistics")
	getStatistics(
		@Query("fields") fields: StatisticsFields[],
		@Query("fromDate") fromDate?: string,
		@Query("toDate") toDate?: string
	) {
		return this.orderService.getStatistics(
			fields,
			fromDate,
			toDate
		);
	}

	@Roles(Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@Post("calculate-shipping-cost")
	calculateShippingCost() {
		return this.orderService.calculateShippingCost();
	}
}
