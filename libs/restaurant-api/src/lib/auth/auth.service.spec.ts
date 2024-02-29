import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { USERS_REPOSITORY } from "../user/constants";
import { StripeService } from "../stripe/stripe.service";
import { ConfigService } from "@nestjs/config";

describe("AuthService", () => {
	let service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				UsersService,
				JwtService,
				StripeService,
				ConfigService,
				{
					provide: USERS_REPOSITORY,
					useValue: jest.fn()
				}
			]
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
