import {
	Price,
	StripeProduct,
	Subscription
} from "./entities";
import {
	PRICE_REPOSITORY,
	STRIPE_PRODUCT_REPOSITORY,
	SUBSCRIPTION_REPOSITORY
} from "./constants";

export const subscriptionProviders = [
	{
		provide: PRICE_REPOSITORY,
		useValue: Price,
	},
	{
		provide: STRIPE_PRODUCT_REPOSITORY,
		useValue: StripeProduct,
	},
	{
		provide: SUBSCRIPTION_REPOSITORY,
		useValue: Subscription
	}
];
