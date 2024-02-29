import { PAYMENTS_REPOSITORY, PAYMENT_METHODS_REPOSITORY } from "./constants";
import { Payment } from "./entities/payment.entity";
import { PaymentMethod } from "./entities/payment-method.entity";

export const paymentProviders = [
	{
		provide: PAYMENTS_REPOSITORY,
		useValue: Payment
	},
	{
		provide: PAYMENT_METHODS_REPOSITORY,
		useValue: PaymentMethod
	}
];
