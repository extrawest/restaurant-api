import { Role } from "../enums";

export interface AuthResponse {
	token?: Token,
};

export type Token = {
	access_token: string;
	refresh_token: string
}

export type LoginProps = {
	onSubmit: (username: string, password: string) => void;
};

export type User = {
	id: number;
	name: string;
	email: string;
	role: Role;
	stripeCustomerId: string;
	currentHashedRefreshToken: string;
	additional_info?: object;
};

export type HandleErrorHookType = {
	trigger: boolean;
	text: string;
};

export type Category = {
	id: number;
	name: string;
};

export type Product = {
	id: number;
	name: string;
	image: string;
	price: number;
	discountedPrice: number;
	currency: string;
	quantity: number;
	categoryId: number;
	category: Category;
};

export type ProductsState = {
	entities: Product[];
}

export type ProductPageParams = {
	id: string;
};

export type DynamicPageProps<T> = {
	params: T;
};

export type ProductsListProps = {
	products: Product[]
}

export type ProductsByCategoriesCarouselProps = {
	products: Product[]; 
};

export type ProductsByCategoriesContainesProps = {
	categoryId: number;
};