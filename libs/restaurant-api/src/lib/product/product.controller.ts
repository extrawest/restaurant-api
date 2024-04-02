import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Query,
	HttpCode
} from "@nestjs/common";
import { Maybe } from "utils";
import { Role } from "../enums/role.enum";
import { ProductDTO } from "./dto/product.dto";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { ProductService } from "./product.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Controller("product")
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	@Post()
	create(@Body() createProductDto: CreateProductDto): Promise<ProductDTO> {
		return this.productService.create(createProductDto);
	}

	@Roles(Role.Buyer, Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	@Get()
	findAll(): Promise<ProductDTO[]> {
		return this.productService.findAll();
	}

	@Roles(Role.Buyer, Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	@Get(":id")
	findOne(@Param("id") id: string): Promise<Maybe<ProductDTO>> {
		return this.productService.findOne(+id);
	}

	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	@Patch(":id")
	update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto): Promise<Maybe<ProductDTO> | Error> {
		return this.productService.update(+id, updateProductDto);
	}

	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	@HttpCode(204)
	@Delete(":id")
	remove(@Param("id") id: string) {
		this.productService.remove(+id);
	}

	@Roles(Role.Admin, Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@Get("/category/:categoryId")
	findProductsByCategory(
		@Param("categoryId") categoryId: string,
		@Query("page") page: number,
		@Query("pageSize") pageSize: number
	): Promise<ProductDTO[]> {
		return this.productService.findProductsByCategory(+categoryId, page, pageSize);
	}
}
