import Stripe from "stripe";
import { NotFoundException } from "@nestjs/common";
import { SUBSCRIPTION_NOT_FOUND, USER_NOT_FOUND } from "shared";
import { UsersService } from "../../user/user.service";
import { SubscriptionsService } from "../../subscriptions/subscriptions.service";

export const subscriptionsEventHandler = async (
	event: Stripe.Event,
	subscriptionService: SubscriptionsService,
	usersService: UsersService,
) => {
	if (event.type === "customer.subscription.created") {
		const {
			customer,
			items,
			status,
			id,
			default_payment_method
		} = event.data.object;
		let user;
		const priceIds = items.data.map((si) => si.price.id);

		if (typeof customer === "string") {
			user = await usersService.findOneByStripeCustomerId(customer);
		};

		if (!user) {
			throw new NotFoundException(USER_NOT_FOUND);
		};

		return subscriptionService.storeSubscription({
			stripeSubscriptionId: id,
			userId: user.id,
			priceIds,
			status,
			defaultPaymentMethodId: typeof default_payment_method === "string" ? default_payment_method : undefined,
		});
	};

	if (event.type === "customer.subscription.deleted") {
		const { id, status } = event.data.object;
		const subscription = await subscriptionService.findOneByStripeSubscriptionId(id);

		if (!subscription) {
			throw new NotFoundException(SUBSCRIPTION_NOT_FOUND);
		};

		return subscriptionService.updateSubscription(subscription.id, { status });
	}

	if (
		event.type === "customer.subscription.paused" ||
		event.type === "customer.subscription.resumed" ||
		event.type === "customer.subscription.updated"
	) {
		const { id, status } = event.data.object;
		const subscription = await subscriptionService.findOneByStripeSubscriptionId(id);

		if (!subscription) {
			throw new NotFoundException(SUBSCRIPTION_NOT_FOUND);
		};

		return subscriptionService.updateSubscription(subscription.id, { status });
	}
	return;
};