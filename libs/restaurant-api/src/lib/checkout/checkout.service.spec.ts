import { faker } from "@faker-js/faker";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { CART_IS_EMPTY, CART_NOT_FOUND } from "shared";
import { BadRequestException } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { CartService } from "../cart/cart.service";
import { Cart } from "../cart/entities/cart.entity";
import { UsersService } from "../user/user.service";
import { CART_REPOSITORY } from "../cart/constants";
import { CheckoutService } from "./checkout.service";
import { USERS_REPOSITORY } from "../user/constants";
import { StripeService } from "../stripe/stripe.service";
import { PaymentService } from "../payment/payment.service";
import { ProducerService } from "../queues/queues.producer";
import { Payment } from "../payment/entities/payment.entity";
import { Address } from "../order/entities/order-address.entity";
import { PAYMENTS_REPOSITORY, PAYMENT_METHODS_REPOSITORY } from "../payment/constants";

const paymentId = faker.string.uuid();
const stripeCustomerId = faker.string.uuid();
const paymentMethodId = faker.string.uuid();

const address = {
	name: faker.person.fullName(),
	first_address: faker.location.streetAddress,
	city: faker.location.city(),
	state: faker.location.state(),
	zip: faker.location.zipCode(),
	country: faker.location.country(),
} as unknown as Address;

const mockCartItem = {
	productId: 1,
	name: faker.person.fullName(),
	quantity: 5,
	price: 10
};

const mockCart = {
	userId: 1,
	totalPrice: 30,
	items: [mockCartItem]
} as unknown as Cart;

const mockEmptyCart = {
	userId: 1,
	totalPrice: 0,
	items: []
} as unknown as Cart;

const mockPayment = {
	id: paymentId,
	amount: 30,
	status: "",
	stripeCustomerId: stripeCustomerId,
	paymentMethodId: paymentMethodId,
} as unknown as Payment;

describe("CheckoutService", () => {
	let checkoutService: CheckoutService;
	let paymentService: PaymentService;
	let cartService: CartService;
	let producerService: ProducerService;

	beforeEach(async () => {
		jest.resetAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				CheckoutService,
				AuthService,
				CartService,
				ProducerService,
				StripeService,
				JwtService,
				PaymentService,
				ConfigService,
				{
					provide: CART_REPOSITORY,
					useValue: jest.fn()
				},
				{
					provide: USERS_REPOSITORY,
					useValue: jest.fn()
				},
				{
					provide: PAYMENTS_REPOSITORY,
					useValue: jest.fn()
				},
				{
					provide: PAYMENT_METHODS_REPOSITORY,
					useValue: jest.fn()
				},
			],
		}).compile();

		checkoutService = module.get<CheckoutService>(CheckoutService);
		cartService = module.get<CartService>(CartService);
		paymentService = module.get<PaymentService>(PaymentService);
		producerService = module.get<ProducerService>(ProducerService);
	});

	it("should be defined", () => {
		expect(checkoutService).toBeDefined();
		expect(paymentService).toBeDefined();
	});

	describe("checkout service", () => {
		it("should checkout", () => {
			jest.spyOn(cartService, "getCart").mockResolvedValueOnce(mockCart);
			jest.spyOn(cartService, "deleteCart").mockResolvedValueOnce(1);
			jest.spyOn(paymentService, "charge").mockResolvedValueOnce(mockPayment);
			jest.spyOn(producerService, "addToOrdersQueue").mockResolvedValueOnce();
			expect(checkoutService.checkout(paymentMethodId, address, 1, stripeCustomerId))
				.resolves
				.not
				.toThrow();
		});

		it("should throw an error on empty cart", () => {
			jest.spyOn(cartService, "getCart").mockResolvedValueOnce(mockEmptyCart);
			expect(checkoutService.checkout(paymentMethodId, address, 1, stripeCustomerId))
				.rejects
				.toThrow(new BadRequestException(CART_IS_EMPTY));
		});

		it("should throw an error on cart not found", () => {
			jest.spyOn(cartService, "getCart").mockResolvedValueOnce(null);
			expect(checkoutService.checkout(paymentMethodId, address,  1, stripeCustomerId))
				.rejects
				.toThrow(new BadRequestException(CART_NOT_FOUND));
		});
	});
});
