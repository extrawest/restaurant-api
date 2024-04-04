import {
	Price,
	PaymnentProduct,
	Subscription
} from "./entities";
import {
	PRICE_REPOSITORY,
	PAYMENT_PRODUCT_REPOSITORY,
	SUBSCRIPTION_REPOSITORY
} from "./constants";

export const subscriptionProviders = [
	{
		provide: PRICE_REPOSITORY,
		useValue: Price,
	},
	{
		provide: PAYMENT_PRODUCT_REPOSITORY,
		useValue: PaymnentProduct,
	},
	{
		provide: SUBSCRIPTION_REPOSITORY,
		useValue: Subscription
	}
];
