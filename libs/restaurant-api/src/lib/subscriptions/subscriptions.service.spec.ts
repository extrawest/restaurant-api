import { faker } from "@faker-js/faker";
import { ConfigService } from "@nestjs/config";
import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import {
	PRICE_NOT_FOUND,
	SUBSCRIPTION_NOT_FOUND,
	USER_NOT_FOUND
} from "shared";
import {
	PAYMENT_PRODUCT_REPOSITORY,
	PRICE_REPOSITORY,
	SUBSCRIPTION_REPOSITORY
} from "./constants";
import { PricesService } from "./prices.service";
import { CartService } from "../cart/cart.service";
import { UsersService } from "../user/user.service";
import { CART_REPOSITORY } from "../cart/constants";
import { USERS_REPOSITORY } from "../user/constants";
import { OrderService } from "../order/order.service";
import { ORDERS_REPOSITORY } from "../order/constants";
import { StripeService } from "../stripe/stripe.service";
import { PaymentService } from "../payment/payment.service";
import { SETTINGS_REPOSITORY } from "../settings/constants";
import { SubscriptionsService } from "./subscriptions.service";
import { SettingsService } from "../settings/settings.service";
import { PaymentInterval } from "../enums/payment-interval.enum";
import { PaymentProductsService } from "./payment-products.service";
import { PAYMENTS_REPOSITORY, PAYMENT_METHODS_REPOSITORY } from "../payment/constants";

const subscriptionsRepositoryMock = {
	findAll: jest.fn(),
	findByPk: jest.fn(),
	create: jest.fn(),
	destroy: jest.fn(),
};

const userMock = {
	id: faker.string.uuid(),
	name: faker.person.fullName(),
	email: faker.internet.email(),
	stripeCustomerId: faker.string.uuid(),
};

const priceMock = {
	id: faker.string.uuid(),
	product: faker.string.uuid(),
	unit_amount: 100,
	interval: PaymentInterval.Month,
	currency: "usd",
	stripePriceId: faker.string.uuid(),
};

const stripeSubscriptionMock = {
	id: faker.string.uuid(),
	status: faker.string.uuid(),
};

const subscriptionMock = {
	id: faker.string.uuid(),
	userId: faker.number.int({ max: 100 }),
	items: [priceMock],
	status: faker.string.uuid(),
	stripeSubscriptionId: faker.string.uuid(),
};

const defaultPaymentMethod = {
	id: faker.string.uuid(),
	type: "card",
	additional_info: {
		number: faker.string.numeric({ length: 16 })
	},
	stripePaymentMethodId: faker.string.uuid(),
	stripeCustomerId: faker.string.uuid(),
};

describe("SubscriptionsService", () => {
	let pricesService: PricesService;
	let paymentProductsService: PaymentProductsService;
	let stripeService: StripeService;
	let subscriptionService: SubscriptionsService;
	let usersService: UsersService;
	let paymentService: PaymentService;

	beforeEach(async () => {
		jest.resetAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SubscriptionsService,
				ConfigService,
				StripeService,
				PricesService,
				PaymentProductsService,
				UsersService,
				PaymentService,
				OrderService,
				CartService,
				SettingsService,
				{
					provide: SUBSCRIPTION_REPOSITORY,
					useValue: subscriptionsRepositoryMock,
				},
				{
					provide: PRICE_REPOSITORY,
					useValue: jest.fn(),
				},
				{
					provide: PAYMENT_PRODUCT_REPOSITORY,
					useValue: jest.fn(),
				},
				{
					provide: USERS_REPOSITORY,
					useValue: jest.fn(),
				},
				{
					provide: PAYMENTS_REPOSITORY,
					useValue: jest.fn(),
				},
				{
					provide: PAYMENT_METHODS_REPOSITORY,
					useValue: jest.fn(),
				},
				{
					provide: ORDERS_REPOSITORY,
					useValue: jest.fn()
				},
				{
					provide: CART_REPOSITORY,
					useValue: jest.fn()
				},
				{
					provide: SETTINGS_REPOSITORY,
					useValue: jest.fn()
				}
			],
		}).compile();

		usersService = module.get<UsersService>(UsersService);
		subscriptionService = module.get<SubscriptionsService>(SubscriptionsService);
		stripeService = module.get<StripeService>(StripeService);
		paymentProductsService = module.get<PaymentProductsService>(PaymentProductsService);
		pricesService = module.get<PricesService>(PricesService);
		paymentService = module.get<PaymentService>(PaymentService);
	});

	it("should be defined", () => {
		expect(pricesService).toBeDefined();
		expect(stripeService).toBeDefined();
		expect(paymentProductsService).toBeDefined();
		expect(subscriptionService).toBeDefined();
		expect(paymentService).toBeDefined();
	});

	describe("create method", () => {
		it("should create subscription", async () => {
			const userId = faker.number.int({ max: 100 });
			const priceIds = [faker.string.uuid()];
			jest.spyOn(usersService, "findOne").mockResolvedValueOnce(userMock as any);
			jest.spyOn(pricesService, "findAllByIds").mockResolvedValueOnce([priceMock] as any);
			jest.spyOn(stripeService, "createSubscription").mockResolvedValueOnce(stripeSubscriptionMock as any);
			// subscriptionsRepositoryMock.create.mockResolvedValueOnce(subscriptionMock);
			expect(await subscriptionService.createStripeSubscription({ userId, priceIds })).toEqual(stripeSubscriptionMock);
			expect(jest.spyOn(usersService, "findOne")).toHaveBeenCalledTimes(1);
			expect(jest.spyOn(pricesService, "findAllByIds")).toHaveBeenCalledTimes(1);
			expect(jest.spyOn(stripeService, "createSubscription")).toHaveBeenCalledTimes(1);
			// expect(subscriptionsRepositoryMock.create).toHaveBeenCalledTimes(1);
		});

		it("should create subscription with defaultPaymentMethod", async () => {
			const userId = faker.number.int({ max: 100 });
			const priceIds = [faker.string.uuid()];
			jest.spyOn(usersService, "findOne").mockResolvedValueOnce(userMock as any);
			jest.spyOn(pricesService, "findAllByIds").mockResolvedValueOnce([priceMock] as any);
			jest.spyOn(paymentService, "getCustomerPaymentMethod").mockResolvedValueOnce(defaultPaymentMethod as any);
			jest.spyOn(stripeService, "createSubscription").mockResolvedValueOnce({
				...stripeSubscriptionMock,
				defaultPaymentMethod,
			} as any);
			// subscriptionsRepositoryMock.create.mockResolvedValueOnce({
			// 	...subscriptionMock,
			// 	defaultPaymentMethod,
			// });
			expect(await subscriptionService.createStripeSubscription({
				userId,
				priceIds,
				defaultPaymentMethodId: defaultPaymentMethod.id
			})).toEqual({
				...stripeSubscriptionMock,
				defaultPaymentMethod,
			});
			expect(jest.spyOn(usersService, "findOne")).toHaveBeenCalledTimes(1);
			expect(jest.spyOn(pricesService, "findAllByIds")).toHaveBeenCalledTimes(1);
			expect(jest.spyOn(stripeService, "createSubscription")).toHaveBeenCalledTimes(1);
			expect(jest.spyOn(paymentService, "getCustomerPaymentMethod")).toHaveBeenCalledTimes(1);
			// expect(subscriptionsRepositoryMock.create).toHaveBeenCalledTimes(1);
		});

		it("should throw USER_NOT_FOUND", async () => {
			const userId = faker.number.int({ max: 100 });
			const priceIds = [faker.string.uuid()];
			jest.spyOn(usersService, "findOne").mockResolvedValueOnce(null);
			expect(subscriptionService.createStripeSubscription({ userId, priceIds }))
				.rejects
				.toThrow(new NotFoundException(USER_NOT_FOUND));
			expect(jest.spyOn(usersService, "findOne")).toHaveBeenCalledTimes(1);
			expect(jest.spyOn(stripeService, "createSubscription")).toHaveBeenCalledTimes(0);
			expect(subscriptionsRepositoryMock.create).toHaveBeenCalledTimes(0);
		});

		it("should throw PRICE_NOT_FOUND", async () => {
			const userId = faker.number.int({ max: 100 });
			const priceIds = [faker.string.uuid()];
			jest.spyOn(usersService, "findOne").mockResolvedValueOnce(userMock as any);
			jest.spyOn(pricesService, "findAllByIds").mockResolvedValueOnce([]);
			expect(subscriptionService.createStripeSubscription({ userId, priceIds }))
				.rejects
				.toThrow(new NotFoundException(PRICE_NOT_FOUND));
			expect(jest.spyOn(usersService, "findOne")).toHaveBeenCalledTimes(1);
			expect(jest.spyOn(stripeService, "createSubscription")).toHaveBeenCalledTimes(0);
			expect(subscriptionsRepositoryMock.create).toHaveBeenCalledTimes(0);
		});
	});

	describe("find method", () => {
		it("should find all subscriptions", async () => {
			subscriptionsRepositoryMock.findAll.mockResolvedValueOnce([subscriptionMock]);
			expect(await subscriptionService.findAllSubscriptions()).toEqual([subscriptionMock]);
			expect(subscriptionsRepositoryMock.findAll).toHaveBeenCalled();
		});

		it("find one subscription", async () => {
			const id = faker.string.uuid();
			subscriptionsRepositoryMock.findByPk.mockResolvedValueOnce(subscriptionMock);
			expect(await subscriptionService.findOneSubscription(id)).toEqual(subscriptionMock);
			expect(subscriptionsRepositoryMock.findByPk).toHaveBeenCalledTimes(1);
			expect(subscriptionsRepositoryMock.findByPk).toHaveBeenCalledWith(id);
		});
	});
	
	describe("update method", () => {
		it("should update subscription", async () => {
			const id = faker.string.uuid();
			const dataToUpdate = {
				status: faker.word.sample()
			};
			const findByPkForUpdateSubscriptionMock = {
				update: jest.fn()
			};
			subscriptionsRepositoryMock.findByPk.mockResolvedValueOnce(findByPkForUpdateSubscriptionMock);
			findByPkForUpdateSubscriptionMock.update.mockResolvedValueOnce(dataToUpdate);
			const result = await subscriptionService.updateSubscription(id, dataToUpdate);
			expect(result).toEqual(dataToUpdate);
			expect(subscriptionsRepositoryMock.findByPk).toHaveBeenCalledTimes(1);
			expect(findByPkForUpdateSubscriptionMock.update).toHaveBeenCalledTimes(1);
			expect(findByPkForUpdateSubscriptionMock.update).toHaveBeenCalledWith(dataToUpdate);
		});

		it("should throw SUBSCRIPTION_NOT_FOUND", async () => {
			const id = faker.string.uuid();
			const dataToUpdate = {
				status: faker.word.sample()
			};
			subscriptionsRepositoryMock.findByPk.mockResolvedValueOnce(null);
			expect(subscriptionService.updateSubscription(id, dataToUpdate)).rejects.toThrow(new NotFoundException(SUBSCRIPTION_NOT_FOUND));
			expect(subscriptionsRepositoryMock.findByPk).toHaveBeenCalledTimes(1);
		});
	});

	describe("cancel method", () => {
		it("should cancel subscription", async () => {
			const id = faker.string.uuid();
			subscriptionsRepositoryMock.findByPk.mockResolvedValueOnce(subscriptionMock);
			jest.spyOn(stripeService, "cancelSubscription").mockResolvedValueOnce(subscriptionMock as any);
			expect(await subscriptionService.cancelStripeSubscription(id)).toEqual(subscriptionMock);
			expect(subscriptionsRepositoryMock.findByPk).toHaveBeenCalledTimes(1);
			expect(subscriptionsRepositoryMock.findByPk).toHaveBeenCalledWith(id);
			expect(jest.spyOn(stripeService, "cancelSubscription")).toHaveBeenCalledTimes(1);
		});

		it("should throw SUBSCRIPTION_NOT_FOUND", async () => {
			const id = faker.string.uuid();
			subscriptionsRepositoryMock.findByPk.mockResolvedValueOnce(null);
			expect(subscriptionService.cancelStripeSubscription(id)).rejects.toThrow(new NotFoundException(SUBSCRIPTION_NOT_FOUND));
			expect(subscriptionsRepositoryMock.findByPk).toHaveBeenCalledTimes(1);
			expect(subscriptionsRepositoryMock.findByPk).toHaveBeenCalledWith(id);
			expect(jest.spyOn(stripeService, "cancelSubscription")).toHaveBeenCalledTimes(0);
		});
	});
});