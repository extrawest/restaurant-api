import { Test, TestingModule } from "@nestjs/testing";
import { OrderService } from "./order.service";
import { ORDERS_REPOSITORY } from "./constants";
import { CartService } from "../cart/cart.service";
import { CART_REPOSITORY } from "../cart/constants";
import { Product } from "../product/entities/product.entity";
import { Cart } from "../cart/entities/cart.entity";
import { CartItem } from "../cart/entities/item.entity";
import { Op } from "sequelize";
import { Status } from "../enums/order.enum";
import { OrderItem } from "./entities/order-item.entity";

const ordersRepositoryMock = {
	create: jest.fn(),
	findOne: jest.fn(),
	findAll: jest.fn(),
};

const cartRepositoryMock = {
	findOne: jest.fn(),
};

const category = {
	name: "Category",
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
	items: [orderItem as unknown as OrderItem],
	paymentId: "dsad"
};

const cart = {
	userId: 1,
	totalPrice: 10,
	items: [{
		productId: 1,
		name: "Name",
		quantity: 10,
		price: 2,
		cartId: 1
	}] as CartItem[],
};

describe("OrderService", () => {
	let orderService: OrderService;
	let cartService: CartService;

	beforeEach(async () => {
		jest.resetAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				OrderService,
				{
					provide: ORDERS_REPOSITORY,
					useValue: ordersRepositoryMock,
				},
				CartService,
				{
					provide: CART_REPOSITORY,
					useValue: cartRepositoryMock,
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
			expect(orderResult).rejects.toThrow(new Error("CART_NOT_FOUND"));
		});

		it("shouldn't create order, should throw CART_IS_EMPTY", async () => {
			const cartFindOneSpy = jest.spyOn(cartService, "getCart").mockResolvedValueOnce(cart as Cart);
			const orderResult = orderService.create({ ...order, items: [] });
			expect(ordersRepositoryMock.create).toHaveBeenCalledTimes(0);
			expect(cartFindOneSpy).toHaveBeenCalledTimes(1);
			expect(cartFindOneSpy).toHaveBeenCalledWith(cart.userId);
			expect(orderResult).rejects.toThrow(new Error("CART_IS_EMPTY"));
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
});