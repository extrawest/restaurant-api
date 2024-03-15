import { Test, TestingModule } from "@nestjs/testing";
import { CartService } from "./cart.service";
import { CART_REPOSITORY } from "./constants";
import { faker } from "@faker-js/faker";
import { Cart } from "./entities/cart.entity";
import { BadRequestException } from "@nestjs/common";
import { CART_ITEM_NOT_FOUND, CART_NOT_FOUND } from "shared";

const cartRepositoryMock = {
	create: jest.fn(),
	findOne: jest.fn(),
};

const userId = 1;
const newQuantity = 4;
const productId = 1;
const itemToUpdate = {
	quantity: newQuantity,
	productId,
};

const cartItem = {
	productId,
	name: faker.commerce.productName(),
	quantity: 2,
	price: 20,
};

const cart = {
	userId,
	items: [cartItem],
	totalPrice: 100
} as unknown as Cart;

describe("CartService", () => {
	let service: CartService;

	beforeEach(async () => {
		jest.resetAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CartService,
				{
					provide: CART_REPOSITORY,
					useValue: cartRepositoryMock,
				}
			]
		}).compile();

		service = module.get<CartService>(CartService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("create method", () => {
		it("should create cart", async () => {
			jest.spyOn(service, "getCart").mockResolvedValueOnce(null);
			cartRepositoryMock.create.mockResolvedValueOnce(cart);
			const result = await service.addItemToCart(1, cartItem);
			expect(result).toEqual(cart);
			expect(jest.spyOn(service, "getCart")).toHaveBeenCalledTimes(1);
			expect(cartRepositoryMock.create).toHaveBeenCalledTimes(1);
			expect(cartRepositoryMock.create).toHaveBeenCalledWith({
				userId,
				items: [{ ...cartItem }],
				totalPrice: 20
			});
		});
	});

	describe("add item method", () => {
		it("should item to the existing cart", async () => {
			const findCardMock = {
				...cart,
				save: jest.fn()
			};
			jest.spyOn(service, "getCart").mockResolvedValueOnce(findCardMock as unknown as Cart);
			findCardMock.save.mockResolvedValueOnce({
				...cart,
				items: [cart.items[0], cartItem]
			});
			const result = await service.addItemToCart(userId, cartItem);
			expect(result.items.length).toBe(2);
			expect(findCardMock.save).toHaveBeenCalledTimes(1);
			expect(jest.spyOn(service, "getCart")).toHaveBeenCalledTimes(1);
		});
	});

	describe("getCart method", () => {
		it("should find cart", async () => {
			cartRepositoryMock.findOne.mockResolvedValueOnce(cart);
			expect(await service.getCart(userId)).toBe(cart);
			expect(cartRepositoryMock.findOne).toHaveBeenCalledTimes(1);
			expect(cartRepositoryMock.findOne).toHaveBeenCalledWith({
				where: { userId }
			});
		});

		it("should not be found", async () => {
			cartRepositoryMock.findOne.mockResolvedValueOnce(null);
			expect(await service.getCart(userId)).toBe(null);
			expect(cartRepositoryMock.findOne).toHaveBeenCalledTimes(1);
			expect(cartRepositoryMock.findOne).toHaveBeenCalledWith({
				where: { userId }
			});
		});
	});

	describe("update method", () => {
		it("should update cart", async () => {
			const findCardMock = {
				...cart,
				save: jest.fn()
			};
			jest.spyOn(service, "getCart").mockResolvedValueOnce(findCardMock as unknown as Cart);
			findCardMock.save.mockResolvedValueOnce(cart);
			expect(await service.updateCart(userId, itemToUpdate)).toEqual(cart);
			expect(findCardMock.save).toHaveBeenCalledTimes(1);
			expect(jest.spyOn(service, "getCart")).toHaveBeenCalledTimes(1);
		});

		it("should throw CART_NOT_FOUND", async () => {
			jest.spyOn(service, "getCart").mockResolvedValueOnce(null);
			expect(service.updateCart(userId, itemToUpdate)).rejects.toThrow(new BadRequestException(CART_NOT_FOUND));
			expect(jest.spyOn(service, "getCart")).toHaveBeenCalledTimes(1);
		});

		it("should throw CART_ITEM_NOT_FOUND", async () => {
			jest.spyOn(service, "getCart").mockResolvedValueOnce(cart);
			expect(service.updateCart(userId, { ...itemToUpdate, productId: 2 })).rejects.toThrow(new BadRequestException(CART_ITEM_NOT_FOUND));
			expect(jest.spyOn(service, "getCart")).toHaveBeenCalledTimes(1);
		});
	});

	describe("removeItemFromCart method", () => {
		it("should remove item", async () => {
			const findCardMock = {
				...cart,
				save: jest.fn()
			};
			jest.spyOn(service, "getCart").mockResolvedValueOnce(findCardMock as unknown as Cart);
			findCardMock.save.mockResolvedValueOnce(cart);
			expect(await service.removeItemFromCart(userId, productId)).toEqual(cart);
			expect(findCardMock.save).toHaveBeenCalledTimes(1);
			expect(jest.spyOn(service, "getCart")).toHaveBeenCalledTimes(1);
		});

		it("should throw CART_NOT_FOUND", async () => {
			jest.spyOn(service, "getCart").mockResolvedValueOnce(null);
			expect(service.removeItemFromCart(userId, productId)).rejects.toThrow(new BadRequestException(CART_NOT_FOUND));
			expect(jest.spyOn(service, "getCart")).toHaveBeenCalledTimes(1);
		});

		it("should throw CART_ITEM_NOT_FOUND", async () => {
			jest.spyOn(service, "getCart").mockResolvedValueOnce(cart);
			expect(service.removeItemFromCart(userId, 3)).rejects.toThrow(new BadRequestException(CART_ITEM_NOT_FOUND));
			expect(jest.spyOn(service, "getCart")).toHaveBeenCalledTimes(1);
		});
	});
});