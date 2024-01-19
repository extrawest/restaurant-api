import { ORDERS_REPOSITORY } from "./constants";
import { Order } from "./entities/order.entity";

export const ordersProviders = [
	{
		provide: ORDERS_REPOSITORY,
		useValue: Order
	}
];
