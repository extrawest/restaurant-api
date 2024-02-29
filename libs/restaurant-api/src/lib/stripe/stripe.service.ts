import Stripe from "stripe";
import {
	HttpException,
	HttpStatus,
	Injectable
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class StripeService {
	private stripe: Stripe;

	constructor(private configService: ConfigService) {
		this.stripe = new Stripe(this.configService.get<string>("STRIPE_SECRET_KEY") as string);
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
					error: "Please provide a valid method type"
				}, HttpStatus.INTERNAL_SERVER_ERROR);
			};
			if (paymentMethod) {
				await this.stripe.paymentMethods.attach(paymentMethod.id, {
					customer: stripeCustomerId
				});
			} else {
				throw new HttpException({
					status: HttpStatus.INTERNAL_SERVER_ERROR,
					error: "Payment method wasn't attached"
				}, HttpStatus.INTERNAL_SERVER_ERROR);
			};
			return paymentMethod;
		} catch(e) {
			throw new HttpException({
				status: HttpStatus.INTERNAL_SERVER_ERROR,
			}, HttpStatus.INTERNAL_SERVER_ERROR);
		};
	}

	getCustomerPaymentMethod(customerId: string,paymentMethodId: string): Promise<Stripe.PaymentMethod> {
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
			currency: "usd",
			confirm: true
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
}
