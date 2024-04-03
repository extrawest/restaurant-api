import { Payment } from "./entities";
import { PaymentMethod } from "./entities";
import {
	PAYMENTS_REPOSITORY,
	PAYMENT_METHODS_REPOSITORY
} from "./constants";

export const paymentProviders = [
	{
		provide: PAYMENTS_REPOSITORY,
		useValue: Payment,
	},
	{
		provide: PAYMENT_METHODS_REPOSITORY,
		useValue: PaymentMethod,
	}
];
