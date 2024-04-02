import { Order } from "./entities";
import { ORDERS_REPOSITORY } from "./constants";

export const ordersProviders = [
	{
		provide: ORDERS_REPOSITORY,
		useValue: Order
	}
];
