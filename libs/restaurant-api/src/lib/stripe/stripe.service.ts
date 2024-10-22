import Stripe from "stripe";
import {
	HttpException,
	HttpStatus,
	Injectable
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
	PAYMENT_METHOD_WAS_NOT_ATTACHED,
	STRIPE_SECRET_KEY_IS_NOT_DEFINED,
	PLEASE_PROVIDE_A_VALID_METHOD_TYPE,
} from "shared";
import { Currency } from "../enums/currency.enum";
import { PaymentInterval } from "../enums/payment-interval.enum";

@Injectable()
export class StripeService {
	private stripe: Stripe;

	constructor(private configService: ConfigService) {
		const stripeSecret = this.configService.get<string>("STRIPE_SECRET_KEY");
		if (!stripeSecret) {
			throw new Error(STRIPE_SECRET_KEY_IS_NOT_DEFINED);
		};
		this.stripe = new Stripe(stripeSecret);
	}

	createCustomer(name: string, email: string): Promise<Stripe.Response<Stripe.Customer>> {
		return this.stripe.customers.create({
			name,
			email,
		});
	}

	async createAndSaveCustomerPaymentMethod(
		stripeCustomerId: string,
		type: string,
		additional_info: {[key: string]: any}
	) {
		try {
			let paymentMethod;
			if (type === "card") {
				paymentMethod = await this.stripe.paymentMethods.create({
					type: "card",
					card: {
						number: additional_info["number"],
						exp_year: additional_info["exp_year"],
						exp_month: additional_info["exp_month"]
					}
				});
			} else {
				throw new HttpException({
					status: HttpStatus.INTERNAL_SERVER_ERROR,
					error: PLEASE_PROVIDE_A_VALID_METHOD_TYPE
				}, HttpStatus.INTERNAL_SERVER_ERROR);
			};
			if (paymentMethod) {
				await this.stripe.paymentMethods.attach(paymentMethod.id, {
					customer: stripeCustomerId
				});
			} else {
				throw new HttpException({
					status: HttpStatus.INTERNAL_SERVER_ERROR,
					error: PAYMENT_METHOD_WAS_NOT_ATTACHED
				}, HttpStatus.INTERNAL_SERVER_ERROR);
			};
			return paymentMethod;
		} catch(e) {
			throw new HttpException({
				status: HttpStatus.INTERNAL_SERVER_ERROR,
			}, HttpStatus.INTERNAL_SERVER_ERROR);
		};
	}

	getCustomerPaymentMethod(customerId: string, paymentMethodId: string): Promise<Stripe.PaymentMethod> {
		return this.stripe.customers.retrievePaymentMethod(customerId, paymentMethodId);
	}

	getCustomerPaymentMethods(
		customerId: string,
		limit?: number,
		starting_after?: string,
		ending_before?: string,
	): Stripe.ApiListPromise<Stripe.PaymentMethod> {
		return this.stripe.customers.listPaymentMethods(customerId, {
			ending_before,
			starting_after,
			limit: limit
		});
	}

	// implement functionality to support multi currency
	charge(amount: number, paymentMethodId: string, customerId: string): Promise<Stripe.Response<Stripe.PaymentIntent>> {
		return this.stripe.paymentIntents.create({
			amount,
			customer: customerId,
			payment_method: paymentMethodId,
			currency: Currency.Usd,
			confirm: true
		}).catch((err) => {
			throw new Error(err);
		});
	}

	listCustomerCharges(
		customerId: string,
		created: Stripe.RangeQueryParam | number,
		limit?: number,
		starting_after?: string,
		ending_before?: string,
	): Stripe.ApiListPromise<Stripe.PaymentIntent> {
		return this.stripe.paymentIntents.list({
			customer: customerId,
			limit,
			starting_after,
			ending_before,
			created
		});
	}

	paymentsSearch(query: string, limit?: number, page?: string): Stripe.ApiSearchResultPromise<Stripe.PaymentIntent> {
		return this.stripe.paymentIntents.search({
			query,
			limit,
			page
		});
	}

	cancelPayment(paymentId: string) {
		this.stripe.paymentIntents.cancel(paymentId);
	}

	createProduct(name: string, description?: string) {
		return this.stripe.products.create({
			name: name,
			description: description
		});
	}

	getProducts() {
		return this.stripe.products.list();
	}

	getProduct(productId: string) {
		return this.stripe.products.retrieve(productId);
	}

	deleteProduct(productId: string) {
		return this.stripe.products.del(productId);
	}
	
	createPrice(
		productId: string,
		priceInUSD: number,
		interval: PaymentInterval
	) {
		return this.stripe.prices.create({
			product: productId,
			unit_amount: priceInUSD * 100,
			currency: Currency.Usd,
			recurring: {
				interval: interval
			}
		});
	}

	getPrices() {
		return this.stripe.prices.list();
	}

	getPrice(priceId: string) {
		return this.stripe.prices.retrieve(priceId);
	}

	createSubscription(
		customerId: string,
		priceIds: string[],
		defaultPaymentMethod?: string
	) {
		return this.stripe.subscriptions.create({
			customer: customerId,
			default_payment_method: defaultPaymentMethod,
			items: priceIds.map((item) => ({
				price: item
			})),
		});
	}

	getSubscriptions() {
		return this.stripe.subscriptions.list();
	}

	getSubscription(subscriptionId: string) {
		return this.stripe.subscriptions.retrieve(subscriptionId);
	}

	cancelSubscription(subscriptionId: string) {
		return this.stripe.subscriptions.cancel(subscriptionId);
	}

	public async constructEventFromPayload(signature: string, payload: Buffer) {
		const webhookSecret = this.configService.get<string>("STRIPE_WEBHOOK_SECRET");
		if (!webhookSecret) {
			throw new Error(STRIPE_SECRET_KEY_IS_NOT_DEFINED);
		};
		return this.stripe.webhooks.constructEvent(
			payload,
			signature,
			webhookSecret
		);
	}
}
