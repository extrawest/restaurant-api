import { Test, TestingModule } from "@nestjs/testing";
import { PaymentService } from "./payment.service";
import { PAYMENTS_REPOSITORY, PAYMENT_METHODS_REPOSITORY } from "./constants";
import { StripeService } from "../stripe/stripe.service";
import { ConfigService } from "@nestjs/config";

const paymentsRepositoryMock = {};
const paymentMethodsRepositoryMock = {};

describe("PaymentService", () => {
	let service: PaymentService;

	beforeEach(async () => {
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

		service = module.get<PaymentService>(PaymentService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
