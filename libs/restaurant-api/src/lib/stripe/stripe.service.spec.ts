import { Test, TestingModule } from "@nestjs/testing";
import { StripeService } from "./stripe.service";

const mockPaymentsIntentsCreate = jest.fn();

jest.mock("stripe", () => jest.fn(() => ({
	paymentIntents: {
		create: (...args: any) => mockPaymentsIntentsCreate(...args) as unknown,
	},
})));

describe("StripeService", () => {
	let service: StripeService;

	beforeEach(async () => {
		jest.resetAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				StripeService
			]
		}).compile();

		service = module.get<StripeService>(StripeService);
	});

	describe("create payment customer", () => {
		it("should create customer", async () => {

		});
	});
});