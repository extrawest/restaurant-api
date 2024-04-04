import { Inject, Injectable } from "@nestjs/common";
import {
	Price,
	PaymnentProduct,
	Subscription
} from "./entities";
import { CreateSubscriptionDTO } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDTO } from "./dto/update-subscription.dto";
import {
	PRICE_REPOSITORY,
	PAYMENT_PRODUCT_REPOSITORY,
	SUBSCRIPTION_REPOSITORY
} from "./constants";

@Injectable()
export class SubscriptionsService {
	constructor(
		@Inject(PRICE_REPOSITORY) private priceRepository: typeof Price,
		@Inject(SUBSCRIPTION_REPOSITORY) private subscriptionRepository: typeof Subscription,
		@Inject(PAYMENT_PRODUCT_REPOSITORY) private paymentProductRepository: typeof PaymnentProduct,
	) {}

	async createSubscription(createSubscriptionDTO: CreateSubscriptionDTO) {
		// return this.stripeService.createSubscription(customerId, priceId, defaultPaymentMethod);
	}

	findAllSubscriptions() {
		return `This action returns all subscriptions`;
	}

	findOneSubscription(id: string) {
		return `This action returns a #${id} subscription`;
	}

	updateSubscription(id: string, updateSubscriptionDTO: UpdateSubscriptionDTO) {

	}

	cancelSubscription(id: string) {
		return `This action removes a #${id} subscription`;
	}
}
