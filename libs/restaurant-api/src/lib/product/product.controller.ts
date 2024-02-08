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
	UseInterceptors,
	UploadedFile,
	ParseFilePipe,
	FileTypeValidator
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Roles } from "../auth/roles.decorator";
import { Role } from "../enums/role.enum";
import { RolesGuard } from "../auth/roles.guard";
import { AuthGuard } from "../auth/auth.guard";
import { ProductDTO } from "./dto/product.dto";
import { Maybe } from "utils";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("product")
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	@Post()
	@UseInterceptors(FileInterceptor("image"))
	create(
		@Body() createProductDto: CreateProductDto,
		@UploadedFile(
			new ParseFilePipe({
				validators: [new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" })]
			})
		)
		image: Express.Multer.File
	): Promise<ProductDTO> {
		return this.productService.create(createProductDto, image);
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
	update(
		@Param("id") id: string,
		@Body() updateProductDto: UpdateProductDto,
		@UploadedFile(
			new ParseFilePipe({
				validators: [new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" })]
			})
		)
		image?: Express.Multer.File
	): Promise<Maybe<ProductDTO> | Error> {
		return this.productService.update(+id, updateProductDto, image);
	}

	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.productService.remove(+id);
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
