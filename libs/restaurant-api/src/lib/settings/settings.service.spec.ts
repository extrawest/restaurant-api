import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { SETTINGS_REPOSITORY } from "./constants";
import { SettingsService } from "./settings.service";
import { SETTINGS_ITEM_DOES_NOT_EXIST } from "shared";

const settingsRepositoryMock = {
	create: jest.fn(),
	findAll: jest.fn(),
	findByPk: jest.fn(),
	findOne: jest.fn(),
	destroy: jest.fn(),
};

const setting = {
	name: "defaultShippingCost",
	data: {
		value: 10,
	},
};

describe("SettingsService", () => {
	let service: SettingsService;

	beforeEach(async () => {
		jest.resetAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SettingsService,
				{
					provide: SETTINGS_REPOSITORY,
					useValue: settingsRepositoryMock
				}
			],
		}).compile();

		service = module.get<SettingsService>(SettingsService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("create method", () => {
		it("should create setting", async () => {
			settingsRepositoryMock.create.mockResolvedValueOnce(setting);
			const result = await service.create({name: setting.name, data: setting.data});
			expect(result).toEqual(setting);
			expect(settingsRepositoryMock.create).toHaveBeenCalledTimes(1);
			expect(settingsRepositoryMock.create).toHaveBeenCalledWith(setting);
		});
	});

	describe("find method", () => {
		it("should find all", async () => {
			settingsRepositoryMock.findAll.mockResolvedValueOnce([
				setting,
			]);
			const result = await service.findAll();
			expect(result.length).toBe(1);
			expect(settingsRepositoryMock.findAll).toHaveBeenCalledTimes(1);
		});

		it("should find by id", async () => {
			const id = faker.number.int({ max: 10 });
			settingsRepositoryMock.findByPk.mockResolvedValueOnce(setting);
			const result = await service.findOneById(id);
			expect(result).toBe(setting);
			expect(settingsRepositoryMock.findByPk).toHaveBeenCalledTimes(1);
			expect(settingsRepositoryMock.findByPk).toHaveBeenCalledWith(id);
		});

		it("should find by name", async () => {
			const name = faker.commerce.product();
			settingsRepositoryMock.findOne.mockResolvedValueOnce(setting);
			const result = await service.findOneByName(name);
			expect(result).toBe(setting);
			expect(settingsRepositoryMock.findOne).toHaveBeenCalledTimes(1);
			expect(settingsRepositoryMock.findOne).toHaveBeenCalledWith({
				where: {
					name
				}
			});
		});
	});

	describe("update method", () => {
		it("should update product", async () => {
			const newShippingCost = 12;
			const settingsFindByPkMock = {
				update: jest.fn()
			};
			settingsRepositoryMock.findByPk.mockResolvedValueOnce(settingsFindByPkMock);
			settingsFindByPkMock.update.mockResolvedValueOnce(
				{
					data: {
						value: newShippingCost
					}
				}
			);

			service.update(1, {
				data: {
					value: newShippingCost
				}
			}).then(res => {
				expect(res?.data["value"]).toBe(newShippingCost);
				expect(settingsRepositoryMock.findByPk).toHaveBeenCalledTimes(1);
				expect(settingsRepositoryMock.findByPk).toHaveBeenCalledWith(1);
				expect(settingsFindByPkMock.update).toHaveBeenCalledTimes(1);
				expect(settingsFindByPkMock.update).toHaveBeenCalledWith({
					data: {
						value: newShippingCost
					}
				});
			});
		});

		it("should throw an error on item not found", async () => {
			const newName = faker.commerce.product();
			settingsRepositoryMock.findByPk.mockResolvedValueOnce(null);
			const result = service.update(1, { name: newName });
			expect(result).rejects.toThrow(new Error(SETTINGS_ITEM_DOES_NOT_EXIST));
			expect(settingsRepositoryMock.findByPk).toHaveBeenCalledTimes(1);
		});
	});

	describe("remove method", () => {
		it("should remove", async () => {
			settingsRepositoryMock.destroy.mockResolvedValueOnce(1);
			const id = faker.number.int(10);
			await service.remove(id);
			expect(settingsRepositoryMock.destroy).toHaveBeenCalledTimes(1);
			expect(settingsRepositoryMock.destroy).toHaveBeenCalledWith({
				where: { id }
			});
		});
	});
});
