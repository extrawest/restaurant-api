import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { PRODUCT_NOT_FOUND } from "shared";
import { PRODUCTS_REPOSITORY } from "./constants";
import { ProductService } from "./product.service";
import { Category } from "../category/entities";

const productRepositoryMock = {
	create: jest.fn(),
	findAll: jest.fn(),
	findOrCreate: jest.fn(),
	findOne: jest.fn(),
	update: jest.fn(),
	destroy: jest.fn(),
};

const product = {
	id: 1,
	name: "Product 1",
	price: 1,
	currency: faker.finance.currency().code,
	categoryId: 1,
	orderId: 1,
	quantity: 1,
	image: faker.image.url()
};

describe("ProductService", () => {
	let service: ProductService;

	beforeEach(async () => {
		jest.resetAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProductService,
				{
					provide: PRODUCTS_REPOSITORY,
					useValue: productRepositoryMock
				}
			]
		}).compile();

		service = module.get<ProductService>(ProductService);
	});

	describe("create method", () => {
		it("should be defined", () => {
			expect(service).toBeDefined();
		});

		it("should create new product", async () => {
			productRepositoryMock.create.mockResolvedValueOnce(product);
			const result = await service.create(product);
			expect(result).toEqual(product);
			expect(productRepositoryMock.create).toHaveBeenCalledTimes(1);
			expect(productRepositoryMock.create).toHaveBeenCalledWith({
				...product,
				discountedPrice: 0,	
			});
		});
	});

	describe("find method", () => {
		it("should be defined", () => {
			expect(service).toBeDefined();
		});

		it("should return all", async () => {
			productRepositoryMock.findAll.mockResolvedValueOnce([
				product,
			]);
			const result = await service.findAll();
			expect(result.length).toBe(1);
			expect(productRepositoryMock.findAll).toHaveBeenCalledTimes(1);
		});

		it("should return one product", async () => {
			productRepositoryMock.findOne.mockResolvedValueOnce(product);
			const result = await service.findOne(1);
			expect(result).toBe(product);
			expect(productRepositoryMock.findOne).toHaveBeenCalledTimes(1);
			expect(productRepositoryMock.findOne).toHaveBeenCalledWith({
				where: { id: product.id }
			});
		});

		it("should return products by category", async () => {
			productRepositoryMock.findAll.mockResolvedValueOnce([product]);
			const result = await service.findProductsByCategory(1, 0, 10);
			expect(result).toEqual([product]);
			expect(productRepositoryMock.findAll).toHaveBeenCalledTimes(1);
			expect(productRepositoryMock.findAll).toHaveBeenCalledWith({
				where: { categoryId: 1 },
				include: [Category],
				offset: 0,
				limit: 10
			});
		});
	});

	describe("update method", () => {
		it("should update product", async () => {
			const newPrice = 2;
			const productFindOneMock = {
				update: jest.fn()
			};
			productRepositoryMock.findOne.mockResolvedValueOnce(productFindOneMock);
			productFindOneMock.update.mockResolvedValueOnce(
				{
					price: newPrice
				}
			);

			service.update(1, { price: newPrice }).then(res => {
				expect(res?.price).toBe(newPrice);
				expect(productRepositoryMock.findOne).toHaveBeenCalledTimes(1);
				expect(productRepositoryMock.findOne).toHaveBeenCalledWith({
					where: { id: product.id }
				});
				expect(productFindOneMock.update).toHaveBeenCalledTimes(1);
				expect(productFindOneMock.update).toHaveBeenCalledWith({
					price: newPrice
				});
			});
		});

		it("should throw an error on item not found", async () => {
			const newName = "New Name";
			productRepositoryMock.findOne.mockResolvedValueOnce(null);
			const result = service.update(1, { name: newName });
			expect(result).rejects.toThrow(new Error(PRODUCT_NOT_FOUND));
			expect(productRepositoryMock.findOne).toHaveBeenCalledTimes(1);
		});
	});

	describe("remove method", () => {
		it("should remove", async () => {
			productRepositoryMock.destroy.mockResolvedValueOnce(1);
			const id = faker.number.int(10);
			await service.remove(id);
			expect(productRepositoryMock.destroy).toHaveBeenCalledTimes(1);
			expect(productRepositoryMock.destroy).toHaveBeenCalledWith({
				where: { id }
			});
		});
	});
});
