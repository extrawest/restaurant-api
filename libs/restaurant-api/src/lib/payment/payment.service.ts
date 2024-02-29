import { Inject, Injectable } from "@nestjs/common";
import { StripeService } from "../stripe/stripe.service";
import { PAYMENTS_REPOSITORY, PAYMENT_METHODS_REPOSITORY } from "./constants";
import { Payment } from "./entities/payment.entity";
import { PaymentMethod } from "./entities/payment-method.entity";

@Injectable()
export class PaymentService {
	constructor(
		private readonly stripeService: StripeService,
		@Inject(PAYMENTS_REPOSITORY) private paymentRepository: typeof Payment,
		@Inject(PAYMENT_METHODS_REPOSITORY) private paymentMethodsRepository: typeof PaymentMethod,
	) {}

	/* PAYMENT METHODS */
	async createAndSaveCustomerPaymentMethod(
		stripeCustomerId: string,
		type: string,
		additional_info: {[key: string]: any}
	) {
		try {
			const stripePaymentMethod = await this.stripeService.createAndSaveCustomerPaymentMethod(
				stripeCustomerId,
				type,
				additional_info
			);
			this.paymentMethodsRepository.create({
				type: type,
				additional_info,
				stripePaymentMethodId: stripePaymentMethod.id
			});
		} catch(e) {
			console.log(e);
		}
	}

	getCustomerPaymentMethods(
		customerId: string,
		limit?: number,
		starting_after?: string,
		ending_before?: string
	) {
		return this.stripeService.getCustomerPaymentMethods(
			customerId,
			limit,
			starting_after,
			ending_before
		);
	}

	getCustomerPaymentMethod(customerId: string, paymentMethodId: string) {
		return this.stripeService.getCustomerPaymentMethod(customerId, paymentMethodId);
	}

	// PAYMENTS
	async charge(amount: number, paymentMethodId: string, customerId: string) {
		const stripeCharge = await this.stripeService.charge(amount, paymentMethodId, customerId);
		return this.paymentRepository.create({
			amount: stripeCharge.amount,
			paymentMethodId: stripeCharge.payment_method,
			customerId: stripeCharge.customer
		});
	}

	getCustomerPayments(stripeCustomerId: string) {
		return this.paymentRepository.findAll({ where: { customerId: stripeCustomerId }});
	}

	getPayments(query?: string, limit?: number, page?: string) {
		return this.stripeService.paymentsSearch(query || "", limit, page);
	}
}
