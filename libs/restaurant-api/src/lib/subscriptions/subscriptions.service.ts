import { Inject, Injectable } from "@nestjs/common";
import {
	Price,
	StripeProduct,
	Subscription
} from "./entities";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDto } from "./dto/update-subscription.dto";
import {
	PRICE_REPOSITORY,
	STRIPE_PRODUCT_REPOSITORY,
	SUBSCRIPTION_REPOSITORY
} from "./constants";

@Injectable()
export class SubscriptionsService {
	constructor(
		@Inject(PRICE_REPOSITORY) private priceRepository: typeof Price,
		@Inject(SUBSCRIPTION_REPOSITORY) private subscriptionRepository: typeof Subscription,
		@Inject(STRIPE_PRODUCT_REPOSITORY) private stripeProductRepository: typeof StripeProduct,
	) {}

	async createSubscription(customerId: string, priceId: string, defaultPaymentMethod?: string) {
		// return this.stripeService.createSubscription(customerId, priceId, defaultPaymentMethod);
	}

	cancelSubscription(subscriptionId: string) {
		// return this.stripeService.cancelSubscription(subscriptionId);
	}

	create(createSubscriptionDto: CreateSubscriptionDto) {
		return "This action adds a new subscription";
	}

	findAll() {
		return `This action returns all subscriptions`;
	}

	findOne(id: number) {
		return `This action returns a #${id} subscription`;
	}

	update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
		return `This action updates a #${id} subscription`;
	}

	remove(id: number) {
		return `This action removes a #${id} subscription`;
	}
}
