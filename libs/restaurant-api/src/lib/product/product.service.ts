import { Inject, Injectable } from "@nestjs/common";
import { PRODUCT_NOT_FOUND } from "shared";
import { Product } from "./entities";
import { Category } from "../category/entities";
import { PRODUCTS_REPOSITORY } from "./constants";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductService {
	constructor(
		@Inject(PRODUCTS_REPOSITORY) private productsRepository: typeof Product,
	) {}
	async create(product: CreateProductDto): Promise<Product> {
		return this.productsRepository.create<Product>({
			...product,
			discountedPrice: product.discountedPrice || 0
		});
	}

	findAll(): Promise<Product[]> {
		return this.productsRepository.findAll<Product>();
	}

	findOne(id: number) {
		return this.productsRepository.findOne<Product>({ where: { id } });
	}

	async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
		const productFound = await this.productsRepository.findOne<Product>({ where: { id } });
		if (productFound) {
			return productFound?.update(updateProductDto);
		};
		throw new Error(PRODUCT_NOT_FOUND);
	}

	remove(id: number) {
		this.productsRepository.destroy({ where: { id } });
	}

	findProductsByCategory(categoryId: number, page: number, pageSize: number) {
		const offset = page * pageSize;
		const limit = pageSize;
		return this.productsRepository.findAll<Product>({
			where: { categoryId },
			include: [Category],
			offset,
			limit
		});
	}
}
