import { faker } from "@faker-js/faker";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { Role } from "../enums/role.enum";
import { UsersService } from "./user.service";
import { USERS_REPOSITORY } from "./constants";
import { StripeService } from "../stripe/stripe.service";
import { USER_NOT_FOUND } from "shared";

const userRepositoryMock = {
	create: jest.fn(),
	findAll: jest.fn(),
	findOne: jest.fn(),
};

const stripeCustomerId = faker.string.uuid();

const user = {
	name: faker.person.fullName(),
	email: faker.internet.email(),
	password: faker.internet.password(),
	role: Role.Buyer,
};

describe("UsersService", () => {
	let service: UsersService;
	let stripeService: StripeService;

	beforeEach(async () => {
		jest.resetAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				StripeService,
				ConfigService,
				{
					provide: USERS_REPOSITORY,
					useValue: userRepositoryMock
				}
			]
		}).compile();
		stripeService = module.get<StripeService>(StripeService);
		service = module.get<UsersService>(UsersService);
	});

	describe("create method", () => {
		it("should be defined", () => {
			expect(service).toBeDefined();
		});

		it("should create new user", async () => {
			jest.spyOn(stripeService, "createCustomer").mockResolvedValueOnce({ id: stripeCustomerId } as any);
			userRepositoryMock.create.mockResolvedValueOnce(user);
			const result = await service.create(user);
			/* eslint-disable @typescript-eslint/no-unused-vars */
			const { password, ...userWithoutPassword } = user;
			expect(result).toEqual(userWithoutPassword);
			expect(userRepositoryMock.create).toHaveBeenCalledTimes(1);
		});
	});

	describe("find method", () => {
		it("should be defined", () => {
			expect(service).toBeDefined();
		});

		it("should return all", async () => {
			userRepositoryMock.findAll.mockResolvedValueOnce([
				user,
			]);
			const result = await service.findAll();
			expect(result.length).toBe(1);
			expect(userRepositoryMock.findAll).toHaveBeenCalledTimes(1);
			expect(userRepositoryMock.findAll).toHaveBeenCalledWith({
				attributes: { exclude: ["password"] }
			});
		});

		it("should return one user", async () => {
			userRepositoryMock.findOne.mockResolvedValueOnce(user);
			const result = await service.findOne(1);
			expect(result).toBe(user);
			expect(userRepositoryMock.findOne).toHaveBeenCalledTimes(1);
			expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
				where: { id: 1 },
				attributes: { exclude: ["password"] }
			});
		});

		it("should return one user by email", async () => {
			userRepositoryMock.findOne.mockResolvedValueOnce(user);
			const result = await service.findOneByEmail(user.email);
			expect(result).toBe(user);
			expect(userRepositoryMock.findOne).toHaveBeenCalledTimes(1);
			expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
				where: { email: user.email }
			});
		});
	});

	describe("update method", () => {
		it("should update product", async () => {
			const userId = 1;
			const objectToUpdate = {
				name: user.name
			};
			const userFindOneMock = {
				update: jest.fn()
			};
			userRepositoryMock.findOne.mockResolvedValueOnce(userFindOneMock);
			userFindOneMock.update.mockResolvedValueOnce(objectToUpdate);

			service.update(userId, objectToUpdate).then(res => {
				expect(res?.name).toBe(objectToUpdate.name);
				expect(userRepositoryMock.findOne).toHaveBeenCalledTimes(1);
				expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
					where: { id: userId },
					attributes: { exclude: ["password"] }
				});
				expect(userFindOneMock.update).toHaveBeenCalledTimes(1);
				expect(userFindOneMock.update).toHaveBeenCalledWith(objectToUpdate);
			});
		});

		it("should throw an error on item not found", async () => {
			const objectToUpdate = {
				name: user.name
			};
			userRepositoryMock.findOne.mockResolvedValueOnce(null);
			const result = service.update(1, objectToUpdate);
			expect(result).rejects.toThrow(new Error(USER_NOT_FOUND));
			expect(userRepositoryMock.findOne).toHaveBeenCalledTimes(1);
		});
	});
});
