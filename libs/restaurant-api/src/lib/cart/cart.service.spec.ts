import { Test, TestingModule } from "@nestjs/testing";
import { CartService } from "./cart.service";
import { CART_REPOSITORY } from "./constants";
import { faker } from "@faker-js/faker";
import { Cart } from "./entities/cart.entity";

const cartRepositoryMock = {
	create: jest.fn(),
};

const cartItem = {
	productId: 1,
	name: faker.commerce.productName(),
	quantity: 2,
	price: 20,
};

const cart = {
	userId: 1,
	items: [cartItem],
	totalPrice: 100
};

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
				userId: 1,
				items: [{ ...cartItem }],
				totalPrice: 20
			});
		});
	});
});