import { faker } from "@faker-js/faker";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { ORDER_WITH_CURRENT_STATUS_CANNOT_BE_CANCELLED } from "shared";
import { Order } from "../order/entities";
import { Status } from "../enums/order.enum";
import { Product } from "../product/entities";
import { CartService } from "../cart/cart.service";
import { PaymentService } from "./payment.service";
import { CART_REPOSITORY } from "../cart/constants";
import { OrderService } from "../order/order.service";
import { ORDERS_REPOSITORY } from "../order/constants";
import { StripeService } from "../stripe/stripe.service";
import { PAYMENTS_REPOSITORY, PAYMENT_METHODS_REPOSITORY } from "./constants";
import { SettingsService } from "../settings/settings.service";
import { SETTINGS_REPOSITORY } from "../settings/constants";

const paymentsRepositoryMock = {
	create: jest.fn(),
	findAll: jest.fn(),
	findAndCountAll: jest.fn(),
};
const paymentMethodsRepositoryMock = {
	create: jest.fn(),
	findAll: jest.fn()
};

const paymentId = faker.string.uuid();
const stripeCustomerId = faker.string.uuid();
const paymentMethodId = faker.string.uuid();
const stripePaymentMethodId = faker.string.uuid();

const paymentMethodMock = {
	customer: faker.string.uuid(),
	type: "card",
	card: {
		exp_month: 2,
		exp_year: 38
	}
} as any;

const paymentsMock = [{
	id: "id",
	amount: 200,
	status: "status",
	stripeCustomerId,
	paymentMethodId,
}, {
	id: "id",
	amount: 100,
	status: "status",
	stripeCustomerId,
	paymentMethodId,
}];

const findAndCountAllPayments = {
	rows: paymentsMock,
	count: paymentsMock.length
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
	paymentId: paymentId,
};

describe("PaymentService", () => {
	let paymentService: PaymentService;
	let stripeService: StripeService;
	let orderService: OrderService;

	beforeEach(async () => {
		jest.resetAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PaymentService,
				StripeService,
				{
					provide: OrderService,
					useValue: {
						getOrderByPaymentId: jest.fn()
					}
				},
				CartService,
				CartService,
				ConfigService,
				SettingsService,
				{
					provide: PAYMENTS_REPOSITORY,
					useValue: paymentsRepositoryMock
				},
				{
					provide: PAYMENT_METHODS_REPOSITORY,
					useValue: paymentMethodsRepositoryMock
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

		orderService = module.get<OrderService>(OrderService);
		paymentService = module.get<PaymentService>(PaymentService);
		stripeService = module.get<StripeService>(StripeService);
	});

	it("should be defined", () => {
		expect(paymentService).toBeDefined();
		expect(stripeService).toBeDefined();
	});

	describe("payment create", () => {
		it("should create payment", async () => {
			const paymentMock = {
				amount: 100,
				paymentMethodId,
				customerId: stripeCustomerId,
			} as any;
			jest.spyOn(stripeService, "charge").mockResolvedValueOnce({
				...paymentMock,
				payment_method: paymentMethodId,
				customer: stripeCustomerId,
				status: "status"
			});
			paymentsRepositoryMock.create.mockResolvedValueOnce(paymentMock);
			expect(await paymentService.charge(100, paymentMethodId, stripeCustomerId)).toEqual({
				...paymentMock,
				payment_method: paymentMethodId,
				customer: stripeCustomerId,
				status: "status"
			});
			expect(jest.spyOn(stripeService, "charge")).toHaveBeenCalledTimes(1);
		});
	});

	describe("find payments", () => {
		it("should find all customer payments", async () => {
			paymentsRepositoryMock.findAll.mockResolvedValueOnce(paymentsMock); 
			expect(await paymentService.getCustomerPayments(stripeCustomerId)).toEqual(paymentsMock);
			expect(paymentsRepositoryMock.findAll).toHaveBeenCalledTimes(1);
			expect(paymentsRepositoryMock.findAll).toHaveBeenCalledWith({
				where: {
					customerId: stripeCustomerId
				}
			});
		});

		it("should find all payments with pagination", async () => {
			paymentsRepositoryMock.findAndCountAll.mockResolvedValueOnce(findAndCountAllPayments); 
			expect(await paymentService.getPayments(5, 0, stripeCustomerId)).toEqual(findAndCountAllPayments);
			expect(paymentsRepositoryMock.findAndCountAll).toHaveBeenCalledTimes(1);
			expect(paymentsRepositoryMock.findAndCountAll).toHaveBeenCalledWith({
				limit: 5,
				offset: 0,
				where: {
					stripeCustomerId: stripeCustomerId
				}
			});
		});

		describe("create payments method", () => {
			it("should create and save payment method", async () => {
				jest.spyOn(stripeService, "createAndSaveCustomerPaymentMethod").mockResolvedValueOnce({
					id: paymentMethodMock.customer,
					type: paymentMethodMock.type
				} as any);
				expect(await paymentService.createAndSaveCustomerPaymentMethod(
					paymentMethodMock.stripeCustomerId,
					paymentMethodMock.type,
					paymentMethodMock.card
				)).toEqual({
					id: paymentMethodMock.customer,
					type: paymentMethodMock.type
				});
				expect(jest.spyOn(stripeService, "createAndSaveCustomerPaymentMethod")).toHaveBeenCalledTimes(1);
			});
		});

		describe("find payments method", () => {
			it("should find customer's payment methods", async () => {
				const findAllPaymentMethodMock = {
					type: "card",
					stripeCustomerId,
					additional_info: {
						number: faker.number.int(),
					},
					stripePaymentMethodId,
				};
				paymentMethodsRepositoryMock.findAll.mockResolvedValueOnce([findAllPaymentMethodMock]); 
				expect(await paymentService.getCustomerPaymentMethods(findAllPaymentMethodMock.stripeCustomerId)).toEqual([findAllPaymentMethodMock]);
				expect(paymentMethodsRepositoryMock.findAll).toHaveBeenCalledTimes(1);
				expect(paymentMethodsRepositoryMock.findAll).toHaveBeenCalledWith({
					where: {
						customerId: findAllPaymentMethodMock.stripeCustomerId
					}
				});
			});
		});

		describe("cancel method", () => {
			it("should cancel payment", async () => {
				jest.spyOn(orderService, "getOrderByPaymentId").mockResolvedValueOnce({
					...order,
					status: Status.Created,
				} as unknown as Order);
				jest.spyOn(stripeService, "cancelPayment").mockImplementationOnce(() => Promise.resolve());
				expect(paymentService.cancelPayment(paymentId)).resolves.not.toThrow();
			});

			it("should throw an error", async () => {
				jest.spyOn(orderService, "getOrderByPaymentId").mockResolvedValueOnce({
					...order,
					status: Status.Cooking,
				} as unknown as Order);
				jest.spyOn(stripeService, "cancelPayment").mockImplementationOnce(() => Promise.resolve());
				expect(paymentService.cancelPayment(paymentId)).rejects.toThrow(new BadRequestException(ORDER_WITH_CURRENT_STATUS_CANNOT_BE_CANCELLED));
			});
		});
	});
});
