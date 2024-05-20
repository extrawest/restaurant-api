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
import { AuthGuard } from "../auth";
import { CategoryDTO } from "./dto/category.dto";
import { Maybe } from "utils";

@Controller("category")
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
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

	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	@Patch(":id")
	update(@Param("id") id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Maybe<CategoryDTO>> {
		return this.categoryService.update(+id, updateCategoryDto);
	}

	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.categoryService.remove(+id);
	}
}
