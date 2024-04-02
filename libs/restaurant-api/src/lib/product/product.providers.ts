import { PRODUCTS_REPOSITORY } from "./constants";
import { Product } from "./entities";

export const productsProviders = [
	{
		provide: PRODUCTS_REPOSITORY,
		useValue: Product
	}
];
