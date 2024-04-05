import {
	Inject,
	Injectable,
	NotFoundException
} from "@nestjs/common";
import { 
	PRICE_NOT_FOUND, 
	SUBSCRIPTION_NOT_FOUND, 
	USER_NOT_FOUND
} from "shared";
import { Subscription } from "./entities";
import { SUBSCRIPTION_REPOSITORY } from "./constants";
import { PricesService } from "./prices.service";
import { UsersService } from "../user/user.service";
import { StripeService } from "../stripe/stripe.service";
import { PaymentService } from "../payment/payment.service";
import { CreateSubscriptionDTO } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDTO } from "./dto/update-subscription.dto";

@Injectable()
export class SubscriptionsService {
	constructor(
		private readonly stripeService: StripeService,
		private readonly usersService: UsersService,
		private readonly paymentService: PaymentService,
		private readonly priceService: PricesService,
		@Inject(SUBSCRIPTION_REPOSITORY) private subscriptionRepository: typeof Subscription,
	) {}

	async createSubscription(createSubscriptionDTO: CreateSubscriptionDTO) {
		const { userId, priceIds, defaultPaymentMethodId } = createSubscriptionDTO;
		const user = await this.usersService.findOne(userId);
		if (!user) {
			throw new NotFoundException(USER_NOT_FOUND);
		};
		const prices = await this.priceService.findAllByIds(priceIds);
		if (!prices) {
			throw new NotFoundException(PRICE_NOT_FOUND);
		};
		const arrayOfPricesIds = prices.map((item) => item.stripePriceId).filter(item => item);
		let defaultPaymentMethod;
		if (defaultPaymentMethodId) {
			defaultPaymentMethod = await this.paymentService.getCustomerPaymentMethod(
				user.stripeCustomerId,
				defaultPaymentMethodId
			);
		};
		const stripeSubscription = await this.stripeService.createSubscription(
			user.stripeCustomerId,
			arrayOfPricesIds,
			defaultPaymentMethod?.stripePaymentMethodId,
		);
		return this.subscriptionRepository.create({
			userId,
			defaultPaymentMethod,
			status: stripeSubscription.status,
			items: prices,
			stripeSubscriptionId: stripeSubscription.id,
		});
	}

	findAllSubscriptions() {
		return this.subscriptionRepository.findAll();
	}

	findOneSubscription(id: string) {
		return this.subscriptionRepository.findByPk(id);
	}

	async updateSubscription(id: string, updateSubscriptionDTO: UpdateSubscriptionDTO) {
		const subscription = await this.findOneSubscription(id);
		if (!subscription) {
			throw new NotFoundException(SUBSCRIPTION_NOT_FOUND);
		};
		return subscription.update(updateSubscriptionDTO);
	}

	async cancelSubscription(id: string) {
		const subscription = await this.findOneSubscription(id);
		if (!subscription) {
			throw new NotFoundException(SUBSCRIPTION_NOT_FOUND);
		};
		return this.stripeService.cancelSubscription(subscription.stripeSubscriptionId);
	}
}
