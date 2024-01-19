import { Inject, Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CATEGORIES_REPOSITORY } from "./constants";
import { Category } from "./entities/category.entity";

@Injectable()
export class CategoryService {
	constructor(@Inject(CATEGORIES_REPOSITORY) private categoriesRepository: typeof Category) {}
	create(createCategoryDto: CreateCategoryDto) {
		return this.categoriesRepository.create<Category>(createCategoryDto);
	}

	findAll(): Promise<Category[]> {
		return this.categoriesRepository.findAll<Category>();
	}

	findOne(id: number) {
		return this.categoriesRepository.findOne<Category>({ where: { id } });
	}

	update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category | Error> {
		return this.categoriesRepository.findOne<Category>({ where: { id } }).then((item) => {
			if (item) item.update(updateCategoryDto);
			return new Error("Category not found");
		});
	}

	remove(id: number) {
		return this.categoriesRepository.destroy({ where: { id } });
	}
}
