import { faker } from "@faker-js/faker";
import { ConfigService } from "@nestjs/config";
import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PAYMENT_PRODUCT_NOT_FOUND, PRICE_NOT_FOUND } from "shared";
import { PaymnentProduct } from "./entities";
import { PricesService } from "./prices.service";
import { StripeService } from "../stripe/stripe.service";
import { PaymentInterval } from "../enums/payment-interval.enum";
import { PaymentProductsService } from "./payment-products.service";
import { PAYMENT_PRODUCT_REPOSITORY, PRICE_REPOSITORY } from "./constants";

const paymentProductMock = {
	id: faker.string.uuid(),
	name: faker.commerce.product(),
	description: faker.commerce.productDescription(),
	paymentProductId: faker.string.uuid(),
} as PaymnentProduct;

const priceMock = {
	id: faker.string.uuid(),
	product: faker.string.uuid(),
	unit_amount: 100,
	interval: PaymentInterval.Month,
	currency: "usd",
	stripePriceId: faker.string.uuid(),
};

const stripePriceMock = {
	...priceMock,
	recurring: {
		interval: priceMock.interval
	}
};

const priceRepositoryMock = {
	create: jest.fn(),
	findAll: jest.fn(),
	findByPk: jest.fn(),
	destroy: jest.fn(),
	update: jest.fn(),
};

describe("PricesService", () => {
	let pricesService: PricesService;
	let paymentProductsService: PaymentProductsService;
	let stripeService: StripeService;

	beforeEach(async () => {
		jest.resetAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ConfigService,
				PricesService,
				PaymentProductsService,
				StripeService,
				{
					provide: PRICE_REPOSITORY,
					useValue: priceRepositoryMock
				},
				{
					provide: PAYMENT_PRODUCT_REPOSITORY,
					useValue: jest.fn(),
				},
			],
		}).compile();

		stripeService = module.get<StripeService>(StripeService);
		paymentProductsService = module.get<PaymentProductsService>(PaymentProductsService);
		pricesService = module.get<PricesService>(PricesService);
	});

	it("should be defined", () => {
		expect(pricesService).toBeDefined();
	});

	describe("create method", () => {
		it("should create price", async () => {
			jest.spyOn(paymentProductsService, "findOnePaymentProduct").mockResolvedValueOnce(paymentProductMock);
			jest.spyOn(stripeService, "createPrice").mockImplementation(() => stripePriceMock as any);
			priceRepositoryMock.create.mockResolvedValueOnce(priceMock);
			const price = await pricesService.createPrice({
				productId: paymentProductMock.id,
				priceInUSD: priceMock.unit_amount,
				interval: priceMock.interval
			});
			expect(jest.spyOn(paymentProductsService, "findOnePaymentProduct")).toHaveBeenCalledTimes(1);
			expect(priceRepositoryMock.create).toHaveBeenCalledTimes(1);
			expect(priceRepositoryMock.create).toHaveBeenLastCalledWith({
				product: paymentProductMock.id,
				unit_amount: price.unit_amount,
				interval: priceMock.interval,
				currency: priceMock.currency,
				stripePriceId: priceMock.id,
			});
			expect(price).toEqual(priceMock);
		});

		it("should throw PAYMENT_PRODUCT_NOT_FOUND", async () => {
			jest.spyOn(paymentProductsService, "findOnePaymentProduct").mockResolvedValueOnce(null);
			expect(pricesService.createPrice({
				productId: paymentProductMock.id,
				priceInUSD: priceMock.unit_amount,
				interval: priceMock.interval
			})).rejects.toThrow(new NotFoundException(PAYMENT_PRODUCT_NOT_FOUND));
			expect(jest.spyOn(paymentProductsService, "findOnePaymentProduct")).toHaveBeenCalledTimes(1);
		});
	});

	describe("find prices", () => {
		it("should find all prices", async () => {
			priceRepositoryMock.findAll.mockResolvedValueOnce([priceMock]); 
			expect(await pricesService.findAllPrices()).toEqual([priceMock]);
			expect(priceRepositoryMock.findAll).toHaveBeenCalledTimes(1);
		});

		it("should find all by ids", async () => {
			const ids = [
				faker.string.uuid(),
				faker.string.uuid(),
			];
			priceRepositoryMock.findAll.mockResolvedValueOnce([priceMock]); 
			expect(await pricesService.findAllByIds(ids)).toEqual([priceMock]);
			expect(priceRepositoryMock.findAll).toHaveBeenCalledTimes(1);
			expect(priceRepositoryMock.findAll).toHaveBeenCalledWith({
				where: {
					id: ids
				}
			});
		});

		it("should find one by pk", async () => {
			const id = faker.string.uuid();
			priceRepositoryMock.findByPk.mockResolvedValueOnce(priceMock); 
			expect(await pricesService.findOnePrice(id)).toEqual(priceMock);
			expect(priceRepositoryMock.findByPk).toHaveBeenCalledTimes(1);
			expect(priceRepositoryMock.findByPk).toHaveBeenCalledWith(id);
		});

		it("should find all by product id", async () => {
			const id = faker.string.uuid();
			priceRepositoryMock.findAll.mockResolvedValueOnce([priceMock]); 
			expect(await pricesService.findPricesByProductId(id)).toEqual([priceMock]);
			expect(priceRepositoryMock.findAll).toHaveBeenCalledTimes(1);
			expect(priceRepositoryMock.findAll).toHaveBeenCalledWith({
				where: {
					product: id
				}
			});
		});
	});

	describe("delete method", () => {
		it("should delete price", async () => {
			const id = faker.string.uuid();
			priceRepositoryMock.destroy.mockResolvedValueOnce(1);
			expect(await pricesService.deletePrice(id)).toEqual(1);
			expect(priceRepositoryMock.destroy).toHaveBeenCalledTimes(1);
			expect(priceRepositoryMock.destroy).toHaveBeenCalledWith({
				where: {
					id
				}
			});
		});
	});

	describe("upate method", () => {
		it("should update price", async () => {
			const id = faker.string.uuid();
			const newInterval = PaymentInterval.Week;
			const findByPkForUpdatePriceMock = {
				update: jest.fn()
			};
			priceRepositoryMock.findByPk.mockResolvedValueOnce(findByPkForUpdatePriceMock);
			findByPkForUpdatePriceMock.update.mockResolvedValueOnce({
				interval: newInterval
			});
			const result = await pricesService.updatePrice(id, {
				interval: newInterval,
			});
			expect(result).toEqual({ interval: newInterval });
			expect(priceRepositoryMock.findByPk).toHaveBeenCalledTimes(1);
			expect(findByPkForUpdatePriceMock.update).toHaveBeenCalledTimes(1);
			expect(findByPkForUpdatePriceMock.update).toHaveBeenCalledWith({
				interval: newInterval
			});
		});

		it("should throw PRICE_NOT_FOUND", async () => {
			const id = faker.string.uuid();
			const newInterval = PaymentInterval.Week;
			priceRepositoryMock.findByPk.mockResolvedValueOnce(null);
			expect(pricesService.updatePrice(id, {
				interval: newInterval,
			})).rejects.toThrow(new NotFoundException(PRICE_NOT_FOUND));
			expect(priceRepositoryMock.findByPk).toHaveBeenCalledTimes(1);
		});
	});
});