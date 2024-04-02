import { Category } from "./entities";
import { CATEGORIES_REPOSITORY } from "./constants";

export const categoriesProviders = [
	{
		provide: CATEGORIES_REPOSITORY,
		useValue: Category
	}
];
