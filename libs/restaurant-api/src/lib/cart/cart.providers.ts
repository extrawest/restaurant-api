import { Cart } from "./entities";
import { CART_REPOSITORY } from "./constants";

export const cartProviders = [
	{
		provide: CART_REPOSITORY,
		useValue: [Cart]
	}
];
