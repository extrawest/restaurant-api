import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcrypt";
import { AuthService } from "./auth.service";
import { UsersService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { USERS_REPOSITORY } from "../user/constants";
import { StripeService } from "../stripe/stripe.service";
import { ConfigService } from "@nestjs/config";
import { faker } from "@faker-js/faker";
import { User } from "../user/entities";
import { Role } from "../enums/role.enum";
import { hash } from "bcrypt";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { PASSWORDS_DO_NOT_MATCH, TOKEN_IS_NOT_VALID_OR_EXPIRED } from "shared";

const fakeEmail = faker.internet.email();
const fakePassword = faker.internet.password();

const usersRepositoryMock = {
	findOne: jest.fn(),
};

const fakeUser = {
	name: faker.person.fullName(),
	email: fakeEmail,
	password: fakePassword,
	role: Role.Buyer,
	stripeCustomerId: faker.string.uuid()
} as User;

describe("AuthService", () => {
	let service: AuthService;
	let usersService: UsersService;
	let jwtService: JwtService;

	beforeEach(async () => {
		jest.resetAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				UsersService,
				JwtService,
				StripeService,
				ConfigService,
				{
					provide: USERS_REPOSITORY,
					useValue: usersRepositoryMock
				}
			]
		}).compile();

		jwtService = module.get<JwtService>(JwtService);
		usersService = module.get<UsersService>(UsersService);
		service = module.get<AuthService>(AuthService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("signIn method", () => {
		it("should sign in", async () => {
			const hashedPassword = await hash(fakePassword, 10);
			jest.spyOn(usersService, "findOneByEmail").mockResolvedValueOnce({
				...fakeUser,
				password: hashedPassword
			} as User);
			usersRepositoryMock.findOne.mockResolvedValueOnce({
				update: jest.fn(),
			});
			jest.spyOn(jwtService, "signAsync").mockResolvedValueOnce("");
			expect((await service.signIn(fakeEmail, fakePassword)).access_token).toBeDefined();
			expect(jest.spyOn(usersService, "findOneByEmail")).toHaveBeenCalledTimes(1);
		});

		it("should throw UnauthorizedException", async () => {
			jest.spyOn(usersService, "findOneByEmail").mockResolvedValueOnce(fakeUser);
			expect((service.signIn(fakeEmail, fakePassword))).rejects.toThrow(new UnauthorizedException());
			expect(jest.spyOn(usersService, "findOneByEmail")).toHaveBeenCalledTimes(1);
		});
	});

	describe("reset password method", () => {
		it("should reset password", async () => {
			const verifySpy = jest.spyOn(jwtService, "verify");
			verifySpy.mockImplementation(() => ({ _id: faker.string.uuid() }));
			const updateSpy = jest.spyOn(usersService, "update");
			updateSpy.mockResolvedValueOnce(fakeUser);
			jest.spyOn(bcrypt, "hash").mockImplementation(() => faker.internet.password());
			await service.resetPassword(fakePassword, fakePassword, faker.string.uuid());
			expect(verifySpy).toHaveBeenCalledTimes(1);
			expect(updateSpy).toHaveBeenCalledTimes(1);
		});

		it("should throw PASSWORDS_DO_NOT_MATCH", async () => {
			expect(service.resetPassword(fakePassword, `${fakePassword}_`, faker.string.uuid()))
				.rejects
				.toThrow(new BadRequestException(PASSWORDS_DO_NOT_MATCH));
		});

		it("should throw TOKEN_IS_NOT_VALID_OR_EXPIRED", async () => {
			jest.spyOn(jwtService, "verify").mockImplementation(() => {
				throw new Error();
			});
			expect(service.resetPassword(fakePassword, fakePassword, faker.string.uuid()))
				.rejects
				.toThrow(new BadRequestException(TOKEN_IS_NOT_VALID_OR_EXPIRED));
		});
	});
});
