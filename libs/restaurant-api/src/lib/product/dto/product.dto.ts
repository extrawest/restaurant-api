import { ApiProperty } from "@nestjs/swagger";

export class ProductDTO {
	@ApiProperty()
	name: string;

	@ApiProperty()
	image: string;

	@ApiProperty()
	price: number;

	@ApiProperty()
	currency: string;

	@ApiProperty()
	quantity: number;

	@ApiProperty()
	categoryId: number;
}
