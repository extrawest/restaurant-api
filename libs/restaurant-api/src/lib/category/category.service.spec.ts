import { Test, TestingModule } from "@nestjs/testing";
import { CategoryService } from "./category.service";
import { CATEGORIES_REPOSITORY } from "./constants";
import { BadRequestException } from "@nestjs/common";

const categoryRepositoryMock = {
	create: jest.fn(),
	findAll: jest.fn(),
	findOrCreate: jest.fn(),
	findOne: jest.fn(),
	update: jest.fn(),
};

describe("CategoryService", () => {
	let service: CategoryService;

	beforeEach(async () => {
		jest.resetAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CategoryService,
				{
					provide: CATEGORIES_REPOSITORY,
					useValue: categoryRepositoryMock,
				}
			]
		}).compile();

		service = module.get<CategoryService>(CategoryService);
	});

	describe("create method", () => {
		it("should be defined", () => {
			expect(service).toBeDefined();
		});

		it("should create new category", async () => {
			categoryRepositoryMock.findOrCreate.mockResolvedValueOnce([{
				name: "Category 1"
			}, true]);
			const result = await service.create({ name: "Category 1" });
			expect(result).toEqual({ name: "Category 1" });
			expect(categoryRepositoryMock.findOrCreate).toHaveBeenCalledTimes(1);
		});

		it("shouldn't create duplicate", async () => {
			categoryRepositoryMock.findOrCreate.mockRejectedValueOnce(
				new BadRequestException("CATEGORY_ALREADY_EXISTS")
			);
			
			expect(service.create({ name: "Fish" }))
				.rejects
				.toThrow(new BadRequestException("CATEGORY_ALREADY_EXISTS"));
			expect(categoryRepositoryMock.findOrCreate).toHaveBeenCalledTimes(1);
		});

		it("should handle empty name", async () => {			
			expect(service.create({ name: "" }))
				.rejects
				.toThrow(new BadRequestException("EMPTY_CATEGORY_NAME"));
			expect(categoryRepositoryMock.findOrCreate).toHaveBeenCalledTimes(0);
		});
	});

	describe("find method", () => {
		it("should be defined", () => {
			expect(service).toBeDefined();
		});

		it("should return all", async () => {
			categoryRepositoryMock.findAll.mockResolvedValueOnce([
				{
					name: "Category 1"
				},
				{
					name: "Category 2"
				},
				{
					name: "Category 3"
				}
			]);
			const result = await service.findAll();
			expect(result.length).toBe(3);
			expect(categoryRepositoryMock.findAll).toHaveBeenCalledTimes(1);
		});

		it("should return one category", async () => {
			categoryRepositoryMock.findOne.mockResolvedValueOnce(
				{
					name: "Category 1"
				}
			);
			const result = await service.findOne(1);
			expect(result?.name).toBe("Category 1");
			expect(categoryRepositoryMock.findOne).toHaveBeenCalledTimes(1);
		});
	});

	describe("update method", () => {
		it("should update category", async () => {
			const newName = "New Name";
			const categoryFindOneMock = {
				update: jest.fn()
			};
			categoryRepositoryMock.findOne.mockResolvedValueOnce(categoryFindOneMock);
			categoryFindOneMock.update.mockResolvedValueOnce(
				{
					name: newName
				}
			);

			const result = await service.update(1, { name: newName });
			expect(result?.name).toBe(newName);
			expect(categoryRepositoryMock.findOne).toHaveBeenCalledTimes(1);
			expect(categoryFindOneMock.update).toHaveBeenCalledTimes(1);
		});

		it("should throw an error on item not found", async () => {
			const newName = "New Name";
			categoryRepositoryMock.findOne.mockRejectedValueOnce(new Error());
			const result = await service.update(1, { name: newName });
			expect(result).toEqual(new Error("Category not found"));
			expect(categoryRepositoryMock.findOne).toHaveBeenCalledTimes(1);
		});
	});
});
