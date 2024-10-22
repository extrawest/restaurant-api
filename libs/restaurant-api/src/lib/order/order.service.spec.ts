import { Op } from "sequelize";
import { faker } from "@faker-js/faker";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CART_IS_EMPTY, CART_NOT_FOUND } from "shared";
import { Address } from "./entities";
import { Cart } from "../cart/entities";
import { Product } from "../product/entities";
import { OrderService } from "./order.service";
import { ORDERS_REPOSITORY } from "./constants";
import { CartService } from "../cart/cart.service";
import { UsersService } from "../user/user.service";
import { USERS_REPOSITORY } from "../user/constants";
import { CART_REPOSITORY } from "../cart/constants";
import { StripeService } from "../stripe/stripe.service";
import { SETTINGS_REPOSITORY } from "../settings/constants";
import { PaymentService } from "../payment/payment.service";
import { StatisticsFields, Status } from "../enums/order.enum";
import { SettingsService } from "../settings/settings.service";
import { PricesService } from "../subscriptions/prices.service";
import { SubscriptionsService } from "../subscriptions/subscriptions.service";

const ordersRepositoryMock = {
	create: jest.fn(),
	findOne: jest.fn(),
	findAll: jest.fn(),
};

const cartRepositoryMock = {
	findOne: jest.fn(),
};

const orderItem = {
	id: 1,
	name: "Product 1",
	price: 1,
	productId: 1,
	quantity: 1,
};

const order = {
	userId: 1,
	items: [orderItem as unknown as Product],
	paymentId: faker.string.uuid(),
	address: {
		name: faker.person.fullName(),
		first_address: faker.location.streetAddress,
		city: faker.location.city(),
		state: faker.location.state(),
		zip: faker.location.zipCode(),
		country: faker.location.country(),
	} as unknown as Address
};

const cart = {
	userId: 1,
	totalPrice: 10,
	items: [{
		id: 1,
		name: "Product 1",
		quantity: 10,
		price: 2,
	}] as Product[],
};

describe("OrderService", () => {
	let orderService: OrderService;
	let cartService: CartService;

	beforeEach(async () => {
		jest.resetAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CartService,
				OrderService,
				UsersService,
				ConfigService,
				StripeService,
				SettingsService,
				{
					provide: PricesService,
					useValue: jest.fn(),
				},
				{
					provide: SubscriptionsService,
					useValue: jest.fn(),
				},
				{
					provide: PaymentService,
					useValue: jest.fn()
				},
				{
					provide: ORDERS_REPOSITORY,
					useValue: ordersRepositoryMock,
				},
				{
					provide: CART_REPOSITORY,
					useValue: cartRepositoryMock,
				},
				{
					provide: SETTINGS_REPOSITORY,
					useValue: jest.fn()
				},
				{
					provide: USERS_REPOSITORY,
					useValue: jest.fn()
				}
			]
		}).compile();

		orderService = module.get<OrderService>(OrderService);
		cartService = module.get<CartService>(CartService);
	});

	describe("create method", () => {
		it("should create order", async () => {
			const cartFindOneSpy = jest.spyOn(cartService, "getCart").mockResolvedValueOnce(cart as Cart);
			ordersRepositoryMock.create.mockResolvedValueOnce(order);
			const orderResult = await orderService.create({ ...order });
			expect(ordersRepositoryMock.create).toHaveBeenCalledTimes(1);
			expect(cartFindOneSpy).toHaveBeenCalledTimes(1);
			expect(ordersRepositoryMock.create).toHaveBeenCalledWith(
				order,
				{ include: [Product] }
			);
			expect(cartFindOneSpy).toHaveBeenCalledWith(cart.userId);
			expect(orderResult).toBe(order);
		});

		it("shouldn't create order, should throw CART_NOT_FOUND", async () => {
			const cartFindOneSpy = jest.spyOn(cartService, "getCart").mockResolvedValueOnce(null);
			const orderResult = orderService.create({ ...order });
			expect(ordersRepositoryMock.create).toHaveBeenCalledTimes(0);
			expect(cartFindOneSpy).toHaveBeenCalledTimes(1);
			expect(cartFindOneSpy).toHaveBeenCalledWith(cart.userId);
			expect(orderResult).rejects.toThrow(new NotFoundException(CART_NOT_FOUND));
		});

		it("shouldn't create order, should throw CART_IS_EMPTY", async () => {
			const cartFindOneSpy = jest.spyOn(cartService, "getCart").mockResolvedValueOnce(cart as Cart);
			const orderResult = orderService.create({ ...order, items: [] });
			expect(ordersRepositoryMock.create).toHaveBeenCalledTimes(0);
			expect(cartFindOneSpy).toHaveBeenCalledTimes(1);
			expect(cartFindOneSpy).toHaveBeenCalledWith(cart.userId);
			expect(orderResult).rejects.toThrow(new BadRequestException(CART_IS_EMPTY));
		});
	});

	describe("find method", () => {
		it("should find all", async () => {
			ordersRepositoryMock.findAll.mockResolvedValueOnce([orderItem]);
			const result = await orderService.findAll();
			expect(ordersRepositoryMock.findAll).toHaveBeenCalledTimes(1);
			expect(result).toEqual([orderItem]);
			expect(result.length).toBe(1);
		});

		it("should find all with date range", async () => {
			ordersRepositoryMock.findAll.mockResolvedValueOnce([orderItem]);
			const fromDate = new Date().toLocaleDateString();
			const toDate = new Date(new Date().getTime() + 86400000).toLocaleDateString();
			const result = await orderService.findAll(
				fromDate,
				toDate
			);
			expect(ordersRepositoryMock.findAll).toHaveBeenCalledTimes(1);
			expect(ordersRepositoryMock.findAll).toHaveBeenCalledWith({
				where: {
					...(fromDate && toDate && {
						createdAt: {
							[Op.and]: {
								[Op.gte]: new Date(fromDate),
								[Op.lte]: new Date(toDate)
							}
						}
					})
				}
			});
			expect(result).toEqual([orderItem]);
			expect(result.length).toBe(1);
		});

		it("should find order by id", async () => {
			ordersRepositoryMock.findOne.mockResolvedValueOnce(order);
			const orderId = 1;
			const result = await orderService.getOrderById(orderId);
			expect(ordersRepositoryMock.findOne).toHaveBeenCalledTimes(1);
			expect(ordersRepositoryMock.findOne).toHaveBeenCalledWith({
				where: {
					id: orderId
				},
				include: [Product]
			});
			expect(result).toEqual(order);
		});

		it("should find orders by userId", async () => {
			ordersRepositoryMock.findAll.mockResolvedValueOnce([order]);
			const userId = 1;
			const result = await orderService.getOrdersByUserId(userId);
			expect(ordersRepositoryMock.findAll).toHaveBeenCalledTimes(1);
			expect(ordersRepositoryMock.findAll).toHaveBeenCalledWith({
				where: {
					userId
				},
				include: [Product]
			});
			expect(result).toEqual([order]);
		});

		it("should find by paymentId", async () => {
			const paymentId = faker.string.uuid();
			ordersRepositoryMock.findOne.mockResolvedValueOnce(order);
			const result = await orderService.getOrderByPaymentId(paymentId);
			expect(result).toEqual(order);
			expect(ordersRepositoryMock.findOne).toHaveBeenCalledTimes(1);
			expect(ordersRepositoryMock.findOne).toHaveBeenCalledWith({
				where: {
					paymentId
				}
			});
		});
	});

	describe("update method", () => {
		it("should update order", async () => {
			const orderId = 1;
			const newPrice = Status.Cooking;
			const orderFindOneMock = {
				update: jest.fn()
			};
			ordersRepositoryMock.findOne.mockResolvedValueOnce(orderFindOneMock);
			orderFindOneMock.update.mockResolvedValueOnce(
				{
					status: Status.Cooking
				}
			);

			orderService.update(orderId, { status: Status.Cooking }).then(res => {
				expect(res?.status).toBe(newPrice);
				expect(ordersRepositoryMock.findOne).toHaveBeenCalledTimes(1);
				expect(ordersRepositoryMock.findOne).toHaveBeenCalledWith({
					where: { id: orderId },
					include: [Product]
				});
				expect(orderFindOneMock.update).toHaveBeenCalledTimes(1);
				expect(orderFindOneMock.update).toHaveBeenCalledWith({
					status: Status.Cooking
				});
			});
		});
	});

	describe("statistics method", () => {
		it("get statistics with date and specific field" , async () => {
			const fromDate = faker.date.past().toLocaleDateString();
			const toDate = faker.date.future().toLocaleDateString();
			ordersRepositoryMock.findAll.mockResolvedValueOnce([
				order
			]);
			const result = await orderService.getStatistics(
				[StatisticsFields.TOTAL_ORDERS],
				fromDate,
				toDate
			);
			expect(result.totalOrdersCount).toBeDefined();
			expect(ordersRepositoryMock.findAll).toHaveBeenCalledTimes(1);
			expect(ordersRepositoryMock.findAll).toHaveBeenCalledWith({
				where: {
					createdAt: {
						[Op.and]: {
							[Op.gte]: new Date(fromDate),
							[Op.lte]: new Date(toDate)
						}
					}
				}
			});
		});

		it("get statistics w/o date and specific field" , async () => {
			const fromDate = faker.date.past().toLocaleDateString();
			ordersRepositoryMock.findAll.mockResolvedValueOnce([
				order
			]);
			const result = await orderService.getStatistics([StatisticsFields.TOTAL_ORDERS], fromDate);
			expect(result.totalOrdersCount).toBeDefined();
			expect(ordersRepositoryMock.findAll).toHaveBeenCalledTimes(1);
		});
	});
});