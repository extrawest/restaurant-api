import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException
} from "@nestjs/common";
import {
	ORDER_NOT_FOUND,
	PAYMENT_NOT_FOUND,
	ORDER_WITH_CURRENT_STATUS_CANNOT_BE_CANCELLED,
} from "shared";
import { Payment} from "./entities";
import { PaymentMethod } from "./entities";
import { OrderService } from "../order/order.service";
import { StoreChargeDTO } from "./dto/store-charge.dto";
import { StripeService } from "../stripe/stripe.service";
import { UpdatePaymentDTO } from "./dto/update-payment.dto";
import { Status as OrderStatus } from "../enums/order.enum";
import { StorePaymentMethodDTO } from "./dto/store-payment-method.dto";
import { PAYMENTS_REPOSITORY, PAYMENT_METHODS_REPOSITORY } from "./constants";

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
		return this.stripeService.createAndSaveCustomerPaymentMethod(
			stripeCustomerId,
			type,
			additional_info
		);
	}

	storePaymentMethod(storePaymentMethodDTO: StorePaymentMethodDTO) {
		const { stripeCustomerId, type, additional_info, stripePaymentMethodId } = storePaymentMethodDTO;
		return this.paymentMethodsRepository.create({
			stripeCustomerId,
			type,
			additional_info,
			stripePaymentMethodId
		});
	}

	getCustomerPaymentMethods(customerId: string) {
		return this.paymentMethodsRepository.findAll({
			where: { customerId }
		});
	}

	getCustomerPaymentMethod(customerId: string, paymentMethodId: string) {
		return this.paymentMethodsRepository.findOne<PaymentMethod>({
			where: {
				id: paymentMethodId,
				stripeCustomerId: customerId
			}
		});
	}

	getCustomerPaymentMethodByStripePaymentMethodId(stripePaymentMethodId: string) {
		return this.paymentMethodsRepository.findOne({
			where: {
				stripePaymentMethodId
			}
		});
	}

	// PAYMENTS
	charge(amount: number, paymentMethodId: string, customerId: string) {
		return this.stripeService.charge(amount, paymentMethodId, customerId);
	}

	storePayment(storeChargeDTO: StoreChargeDTO) {
		const {
			amount,
			paymentMethodId,
			stripeCustomerId,
			status,
			stripePaymentId
		} = storeChargeDTO;
		return this.paymentRepository.create({
			amount: amount,
			paymentMethodId: paymentMethodId,
			customerId: stripeCustomerId,
			status: status,
			stripePaymentId
		});
	}

	getPayment(id: string) {
		return this.paymentRepository.findByPk(id);
	}

	getPaymentByStripeId(id: string) {
		return this.paymentRepository.findOne({
			where: {
				stripePaymentId: id
			}
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
			throw new BadRequestException(ORDER_NOT_FOUND);
		};

		if (
			order.status === OrderStatus.Cooking ||
			order.status === OrderStatus.Delivering ||
			order.status === OrderStatus.Delivered
		) {
			throw new BadRequestException(ORDER_WITH_CURRENT_STATUS_CANNOT_BE_CANCELLED);
		};

		this.stripeService.cancelPayment(paymentId);
	}

	async updatePayment(id: string, updatePaymentDTO: UpdatePaymentDTO) {
		const payment = await this.getPayment(id);

		if (!payment) {
			throw new NotFoundException(PAYMENT_NOT_FOUND);
		};

		return payment.update(updatePaymentDTO);
	}
}
