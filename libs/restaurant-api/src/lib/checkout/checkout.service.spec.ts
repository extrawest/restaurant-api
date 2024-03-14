import { Test, TestingModule } from "@nestjs/testing";
import { CheckoutService } from "./checkout.service";
import { AuthService } from "../auth/auth.service";
import { CartService } from "../cart/cart.service";
import { PaymentService } from "../payment/payment.service";
import { ProducerService } from "../queues/queues.producer";
import { Cart } from "../cart/entities/cart.entity";
import { Payment } from "../payment/entities/payment.entity";
import { BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { USERS_REPOSITORY } from "../user/constants";
import { UsersService } from "../user/user.service";
import { StripeService } from "../stripe/stripe.service";
import { CART_REPOSITORY } from "../cart/constants";
import { ConfigService } from "@nestjs/config";
import { PAYMENTS_REPOSITORY, PAYMENT_METHODS_REPOSITORY } from "../payment/constants";
import { CART_IS_EMPTY, CART_NOT_FOUND } from "shared";

const mockCartItem = {
	productId: "",
	name: "",
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
	id: "",
	amount: 30,
	status: "",
	stripeCustomerId: "",
	paymentMethodId: "",
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
			expect(checkoutService.checkout("paymentMethodId", 1, "stripeCustomerId"))
				.resolves
				.not
				.toThrow();
		});

		it("should throw an error on empty cart", () => {
			jest.spyOn(cartService, "getCart").mockResolvedValueOnce(mockEmptyCart);
			expect(checkoutService.checkout("paymentMethodId", 1, "stripeCustomerId"))
				.rejects
				.toThrow(new BadRequestException(CART_IS_EMPTY));
		});

		it("should throw an error on cart not found", () => {
			jest.spyOn(cartService, "getCart").mockResolvedValueOnce(null);
			expect(checkoutService.checkout("paymentMethodId", 1, "stripeCustomerId"))
				.rejects
				.toThrow(new BadRequestException(CART_NOT_FOUND));
		});
	});
});
