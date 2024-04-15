import Stripe from "stripe";
import { PaymentService } from "../../payment/payment.service";
import { NotFoundException } from "@nestjs/common";
import { PAYMENT_NOT_FOUND } from "shared";

export const paymentEventHandler = async (
	event: Stripe.Event,
	paymentService: PaymentService,
) => {
	if (event.type === "payment_intent.created") {
		const { id, amount, payment_method, status, customer } = event.data.object;
		const paymentMethodId = typeof payment_method === "string" ? payment_method : payment_method?.id;
		const stripeCustomerId = typeof customer === "string" ? customer : customer?.id;
		return await paymentService.storePayment({
			paymentMethodId,
			status,
			stripeCustomerId,
			amount,
			stripePaymentId: id,
		});
	};

	if (
		event.type === "payment_intent.canceled" ||
		event.type === "payment_intent.succeeded" ||
		event.type === "payment_intent.processing" ||
		event.type === "payment_intent.payment_failed"
	) {
		const { id, status } = event.data.object;
		const payment = await paymentService.getPaymentByStripeId(id);

		if (!payment) {
			throw new NotFoundException(PAYMENT_NOT_FOUND);
		};

		return await paymentService.updatePayment(payment.id, {
			status
		});
	};
};