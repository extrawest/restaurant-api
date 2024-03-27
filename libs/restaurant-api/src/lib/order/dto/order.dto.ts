import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../../product/entities";

export class OrderDTO {
	@ApiProperty()
	userId: number;

	@ApiProperty()
	items: Product[];
}
