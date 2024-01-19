import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../../product/entities/product.entity";

export class CreateOrderDto {
	@ApiProperty()
	userId: number;

	@ApiProperty()
	products: Product[];
}
