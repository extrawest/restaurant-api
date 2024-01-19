import { CART_REPOSITORY } from "./constants";
import { Cart } from "./entities/cart.entity";

export const categoriesProviders = [
	{
		provide: CART_REPOSITORY,
		useValue: [Cart]
	}
];
