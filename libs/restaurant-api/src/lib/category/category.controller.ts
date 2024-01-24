import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Roles } from "../auth/roles.decorator";
import { Role } from "../enums/role.enum";
import { RolesGuard } from "../auth/roles.guard";
import { AuthGuard } from "../auth/auth.guard";
import { CategoryDTO } from "./dto/category.dto";
import { Maybe } from "utils";

@Roles(Role.Admin)
@UseGuards(AuthGuard, RolesGuard)
@Controller("category")
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Post()
	create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryDTO> {
		return this.categoryService.create(createCategoryDto);
	}

	@Get()
	findAll(): Promise<CategoryDTO[]> {
		return this.categoryService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string): Promise<Maybe<CategoryDTO>> {
		return this.categoryService.findOne(+id);
	}

	@UseGuards(AuthGuard)
	@Patch(":id")
	update(@Param("id") id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<CategoryDTO> {
		return this.categoryService.update(+id, updateCategoryDto);
	}

	@UseGuards(AuthGuard)
	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.categoryService.remove(+id);
	}
}
