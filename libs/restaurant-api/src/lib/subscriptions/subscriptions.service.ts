import {
	Inject,
	Injectable,
	NotFoundException
} from "@nestjs/common";
import {
	USER_NOT_FOUND,
	PRICE_NOT_FOUND,
	SUBSCRIPTION_NOT_FOUND,
} from "shared";
import { Subscription } from "./entities";
import { PricesService } from "./prices.service";
import { UsersService } from "../user/user.service";
import { SUBSCRIPTION_REPOSITORY } from "./constants";
import { StripeService } from "../stripe/stripe.service";
import { PaymentService } from "../payment/payment.service";
import { UpdateSubscriptionDTO } from "./dto/update-subscription.dto";
import { StoreSubscriptionDTO } from "./dto/store-subscription.dto";
import { CreateSubscriptionDTO } from "./dto/create-subscription.dto";

@Injectable()
export class SubscriptionsService {
	constructor(
		private readonly stripeService: StripeService,
		private readonly usersService: UsersService,
		private readonly paymentService: PaymentService,
		private readonly priceService: PricesService,
		@Inject(SUBSCRIPTION_REPOSITORY) private subscriptionRepository: typeof Subscription,
	) {}

	async createStripeSubscription(createSubscriptionDTO: CreateSubscriptionDTO) {
		const { userId, priceIds, defaultPaymentMethodId } = createSubscriptionDTO;
		const user = await this.usersService.findOne(userId);
		if (!user) {
			throw new NotFoundException(USER_NOT_FOUND);
		};
		const prices = await this.priceService.findAllByIds(priceIds);
		if (!prices || !prices?.length) {
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
		return this.stripeService.createSubscription(
			user.stripeCustomerId,
			arrayOfPricesIds,
			defaultPaymentMethod?.stripePaymentMethodId,
		);
	}

	async storeSubscription(storeSubscriptionDTO: StoreSubscriptionDTO) {
		const { userId, defaultPaymentMethodId, status, priceIds, stripeSubscriptionId } = storeSubscriptionDTO;
		const user = await this.usersService.findOne(userId);
		let defaultPaymentMethod;
		if (!user) {
			throw new NotFoundException(USER_NOT_FOUND);
		};
		const items = await this.priceService.findAllByIds(priceIds);
		if (defaultPaymentMethodId) {
			defaultPaymentMethod = await this.paymentService.getCustomerPaymentMethod(user?.stripeCustomerId, defaultPaymentMethodId);
		};
		return this.subscriptionRepository.create({
			userId,
			defaultPaymentMethod,
			status,
			items,
			stripeSubscriptionId,
		});
	}

	findAllSubscriptions() {
		return this.subscriptionRepository.findAll();
	}

	findOneSubscription(id: string) {
		return this.subscriptionRepository.findByPk(id);
	}

	findOneByStripeSubscriptionId(stripeSubscriptionId: string) {
		return this.subscriptionRepository.findOne({
			where: {
				stripeSubscriptionId
			}
		});
	};

	async updateSubscription(id: string, updateSubscriptionDTO: UpdateSubscriptionDTO) {
		const subscription = await this.findOneSubscription(id);
		if (!subscription) {
			throw new NotFoundException(SUBSCRIPTION_NOT_FOUND);
		};
		return subscription.update(updateSubscriptionDTO);
	}

	async cancelStripeSubscription(id: string) {
		const subscription = await this.findOneSubscription(id);
		if (!subscription) {
			throw new NotFoundException(SUBSCRIPTION_NOT_FOUND);
		};
		return this.stripeService.cancelSubscription(subscription.stripeSubscriptionId);
	}
}
