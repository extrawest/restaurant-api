import { CART_REPOSITORY } from "./constants";
import { Cart } from "./entities/cart.entity";

export const cartProviders = [
	{
		provide: CART_REPOSITORY,
		useValue: [Cart]
	}
];
