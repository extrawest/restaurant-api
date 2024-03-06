import { Test, TestingModule } from "@nestjs/testing";
import { PaymentService } from "./payment.service";
import { PAYMENTS_REPOSITORY, PAYMENT_METHODS_REPOSITORY } from "./constants";
import { StripeService } from "../stripe/stripe.service";
import { ConfigService } from "@nestjs/config";

const paymentsRepositoryMock = {
	create: jest.fn(),
	findAll: jest.fn(),
	findAndCountAll: jest.fn(),
};
const paymentMethodsRepositoryMock = {
	create: jest.fn(),
	findAll: jest.fn()
};

const paymentMethodMock = {
	customer: "stripeCustomerId",
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
	stripeCustomerId: "stripeCustomerId",
	paymentMethodId: "paymentMethodId",
}, {
	id: "id",
	amount: 100,
	status: "status",
	stripeCustomerId: "stripeCustomerId",
	paymentMethodId: "paymentMethodId",
}];

const findAndCountAllPayments = {
	rows: paymentsMock,
	count: paymentsMock.length
};

describe("PaymentService", () => {
	let paymentService: PaymentService;
	let stripeService: StripeService;

	beforeEach(async () => {
		jest.resetAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PaymentService,
				StripeService,
				ConfigService,
				{
					provide: PAYMENTS_REPOSITORY,
					useValue: paymentsRepositoryMock
				},
				{
					provide: PAYMENT_METHODS_REPOSITORY,
					useValue: paymentMethodsRepositoryMock
				}
			],
		}).compile();

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
				paymentMethodId: "paymentMethodId",
				customerId: "customerId",
			} as any;
			jest.spyOn(stripeService, "charge").mockResolvedValueOnce({
				...paymentMock,
				payment_method: "paymentMethodId",
				customer: "customerId",
				status: "status"
			});
			paymentsRepositoryMock.create.mockResolvedValueOnce(paymentMock);
			expect(await paymentService.charge(100, "paymentMethodId", "customerId")).toEqual(paymentMock);
			expect(jest.spyOn(stripeService, "charge")).toHaveBeenCalledTimes(1);
			expect(paymentsRepositoryMock.create).toHaveBeenCalledTimes(1);
			expect(paymentsRepositoryMock.create).toHaveBeenCalledWith({
				amount: 100,
				paymentMethodId: "paymentMethodId",
				customerId: "customerId",
				status: "status",
			});
		});
	});

	describe("find payments", () => {
		it("should find all customer payments", async () => {
			const stripeCustomerId = "customerId";
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
			const stripeCustomerId = "customerId";
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
				paymentMethodsRepositoryMock.create.mockResolvedValueOnce(paymentsMock); 
				expect(await paymentService.createAndSaveCustomerPaymentMethod(
					paymentMethodMock.stripeCustomerId,
					paymentMethodMock.type,
					paymentMethodMock.card
				)).toEqual(paymentsMock);
				expect(paymentMethodsRepositoryMock.create).toHaveBeenCalledTimes(1);
				expect(paymentMethodsRepositoryMock.create).toHaveBeenCalledWith({
					type: paymentMethodMock.type,
					additional_info: paymentMethodMock.card,
					stripePaymentMethodId: paymentMethodMock.customer
				});
			});
		});

		describe("find payments method", () => {
			it("should find customer's payment methods", async () => {
				const findAllPaymentMethodMock = {
					type: "card",
					stripeCustomerId: "stripeCustomerId",
					additional_info: {
						number: 123,
					},
					stripePaymentMethodId: "stripePaymentMethodId"
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
	});
});
