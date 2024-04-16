import { faker } from "@faker-js/faker";
import { ConfigService } from "@nestjs/config";
import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PAYMENT_PRODUCT_NOT_FOUND } from "shared";
import { PAYMENT_PRODUCT_REPOSITORY } from "./constants";
import { StripeService } from "../stripe/stripe.service";
import { PaymentProductsService } from "./payment-products.service";

const paymentProductRepositoryMock = {
	findAll: jest.fn(),
	findByPk: jest.fn(),
	create: jest.fn(),
	destroy: jest.fn(),
};

const stripeProduct = {
	id: faker.string.uuid(),
	name: faker.commerce.product(),
	description: faker.commerce.productDescription(),
};

const paymentProductMock = {
	name: faker.commerce.product(),
	description: faker.commerce.productDescription(),
};

describe("PaymentProduct service", () => {
	let paymentProductsService: PaymentProductsService;
	let stripeService: StripeService;

	beforeEach(async () => {
		jest.resetAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ConfigService,
				PaymentProductsService,
				StripeService,
				{
					provide: PAYMENT_PRODUCT_REPOSITORY,
					useValue: paymentProductRepositoryMock,
				},
			],
		}).compile();

		stripeService = module.get<StripeService>(StripeService);
		paymentProductsService = module.get<PaymentProductsService>(PaymentProductsService);
	});

	it("should be defined", () => {
		expect(stripeService).toBeDefined();
		expect(paymentProductsService).toBeDefined();
	});

	describe("create method", () => {
		it("should create payment product", async () => {
			jest.spyOn(stripeService, "createProduct").mockImplementationOnce(() => Promise.resolve(stripeProduct as any));
			paymentProductRepositoryMock.create.mockResolvedValueOnce(paymentProductMock);
			const result = await paymentProductsService.createPaymentProduct(paymentProductMock);
			expect(result).toEqual(stripeProduct);
			expect(jest.spyOn(stripeService, "createProduct")).toHaveBeenCalledTimes(1);
		});
	});

	describe("find method", () => {
		it("should find all", async () => {
			paymentProductRepositoryMock.findAll.mockResolvedValueOnce([paymentProductMock]);
			expect(await paymentProductsService.findAllPaymentProducts()).toEqual([paymentProductMock]);
			expect(paymentProductRepositoryMock.findAll).toHaveBeenCalledTimes(1);
		});
		it("should find one payment product", async () => {
			const id = faker.string.uuid();
			paymentProductRepositoryMock.findByPk.mockResolvedValueOnce(paymentProductMock);
			expect(await paymentProductsService.findOnePaymentProduct(id)).toEqual(paymentProductMock);
			expect(paymentProductRepositoryMock.findByPk).toHaveBeenCalledTimes(1);
			expect(paymentProductRepositoryMock.findByPk).toHaveBeenCalledWith(id);
		});
	});

	describe("update method", () => {
		it("should update payment product", async () => {
			const id = faker.string.uuid();
			const dataToUpdate = {
				description: faker.commerce.productDescription()
			};
			const findByPkForUpdatePaymentProductMock = {
				update: jest.fn(),
			};
			paymentProductRepositoryMock.findByPk.mockResolvedValueOnce(findByPkForUpdatePaymentProductMock);
			findByPkForUpdatePaymentProductMock.update.mockResolvedValueOnce(dataToUpdate);
			expect(await paymentProductsService.updatePaymentProduct(id, dataToUpdate)).toEqual(dataToUpdate);
			expect(paymentProductRepositoryMock.findByPk).toHaveBeenCalledTimes(1);
			expect(paymentProductRepositoryMock.findByPk).toHaveBeenCalledWith(id);
			expect(findByPkForUpdatePaymentProductMock.update).toHaveBeenCalledTimes(1);
			expect(findByPkForUpdatePaymentProductMock.update).toHaveBeenCalledWith(dataToUpdate);
		});

		it("should throw PAYMENT_PRODUCT_NOT_FOUND", async () => {
			const id = faker.string.uuid();
			const dataToUpdate = {
				description: faker.commerce.productDescription()
			};
			paymentProductRepositoryMock.findByPk.mockResolvedValueOnce(null);
			expect(paymentProductsService.updatePaymentProduct(id, dataToUpdate)).rejects.toThrow(new NotFoundException(PAYMENT_PRODUCT_NOT_FOUND));
			expect(paymentProductRepositoryMock.findByPk).toHaveBeenCalledTimes(1);
			expect(paymentProductRepositoryMock.findByPk).toHaveBeenCalledWith(id);
		});
	});

	describe("delete method", () => {
		it("should delete payment product", async () => {
			const id = faker.string.uuid();
			paymentProductRepositoryMock.destroy.mockResolvedValueOnce(1);
			expect(await paymentProductsService.deletePaymentProduct(id)).toEqual(1);
			expect(paymentProductRepositoryMock.destroy).toHaveBeenCalledTimes(1);
			expect(paymentProductRepositoryMock.destroy).toHaveBeenCalledWith({
				where: {
					id
				}
			});
		});
	});
});