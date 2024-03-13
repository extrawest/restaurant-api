import {
	BadRequestException,
	Inject,
	Injectable
} from "@nestjs/common";
import { StripeService } from "../stripe/stripe.service";
import { PAYMENTS_REPOSITORY, PAYMENT_METHODS_REPOSITORY } from "./constants";
import { Payment } from "./entities/payment.entity";
import { PaymentMethod } from "./entities/payment-method.entity";
import { OrderService } from "../order/order.service";
import { Status as OrderStatus } from "../enums/order.enum";

@Injectable()
export class PaymentService {
	constructor(
		private readonly stripeService: StripeService,
		private readonly orderService: OrderService,
		@Inject(PAYMENTS_REPOSITORY) private paymentRepository: typeof Payment,
		@Inject(PAYMENT_METHODS_REPOSITORY) private paymentMethodsRepository: typeof PaymentMethod,
	) {}

	/* PAYMENT METHODS */
	async createAndSaveCustomerPaymentMethod(
		stripeCustomerId: string,
		type: string,
		additional_info: {[key: string]: any}
	) {
		const stripePaymentMethod = await this.stripeService.createAndSaveCustomerPaymentMethod(
			stripeCustomerId,
			type,
			additional_info
		);
		return this.paymentMethodsRepository.create({
			stripeCustomerId: stripeCustomerId,
			type: stripePaymentMethod.type,
			additional_info,
			stripePaymentMethodId: stripePaymentMethod.id
		});
	}

	getCustomerPaymentMethods(customerId: string) {
		return this.paymentMethodsRepository.findAll({
			where: { customerId }
		});
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
			customerId: stripeCharge.customer,
			status: stripeCharge.status,
		});
	}

	getCustomerPayments(stripeCustomerId: string) {
		return this.paymentRepository.findAll({ where: { customerId: stripeCustomerId }});
	}

	getPayments(limit: number, offset: number, stripeCustomerId?: string) {
		return this.paymentRepository.findAndCountAll({
			offset,
			limit,
			...(stripeCustomerId && ({
				where: { stripeCustomerId }
			}))
		});
	}

	async cancelPayment(paymentId: string) {
		const order = await this.orderService.getOrderByPaymentId(paymentId);
		if (!order) {
			throw new BadRequestException("ORDER_NOT_FOUND");
		};
		if (
			order.status === OrderStatus.Cooking ||
			order.status === OrderStatus.Delivering ||
			order.status === OrderStatus.Delivered
		) {
			throw new BadRequestException("ORDER_WITH_CURRENT_STATUS_CANNOT_BE_CANCELLED");
		};
		this.stripeService.cancelPayment(paymentId);
	}
}
