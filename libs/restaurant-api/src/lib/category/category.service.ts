import {
	BadRequestException,
	Inject,
	Injectable
} from "@nestjs/common";
import {
	CATEGORY_ALREADY_EXISTS,
	CATEGORY_NOT_FOUND,
	EMPTY_CATEGORY_NAME
} from "shared";
import { Maybe } from "utils";
import { Category } from "./entities";
import { CATEGORIES_REPOSITORY } from "./constants";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
	constructor(@Inject(CATEGORIES_REPOSITORY) private categoriesRepository: typeof Category) {}
	async create(createCategoryDto: CreateCategoryDto) {
		const { name } = createCategoryDto;
		if (!name?.length) {
			throw new BadRequestException(EMPTY_CATEGORY_NAME);
		};
		return this.findOrCreate(name);
	}

	findOrCreate(name: string) {
		return this.categoriesRepository.findOrCreate<Category>({ where: { name } })
			.then((res) => {
				const category = res[0];
				const created = res[1];
				if (created) {
					return category;
				};
				throw new BadRequestException(CATEGORY_ALREADY_EXISTS);
			});
	}

	findAll(): Promise<Category[]> {
		return this.categoriesRepository.findAll<Category>();
	}

	findOne(id: number) {
		return this.categoriesRepository.findOne<Category>({ where: { id } });
	}

	async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Maybe<Category>> {
		const category = await this.categoriesRepository.findOne<Category>({ where: { id } });
		if (category) {
			return category?.update(updateCategoryDto);
		};
		throw new BadRequestException(CATEGORY_NOT_FOUND);
	}

	remove(id: number) {
		return this.categoriesRepository.destroy({ where: { id } });
	}
}
