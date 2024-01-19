import { PRODUCTS_REPOSITORY } from "./constants";
import { Product } from "./entities/product.entity";

export const productsProviders = [
	{
		provide: PRODUCTS_REPOSITORY,
		useValue: Product
	}
];
