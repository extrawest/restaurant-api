import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../../product/entities/product.entity";

export class OrderDTO {
	@ApiProperty()
	userId: number;

	@ApiProperty()
	products: Product[];
}
