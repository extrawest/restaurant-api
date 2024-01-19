import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
	@ApiProperty()
	name: string;

	@ApiProperty({
		type: "bytea"
	})
	image: Uint8Array;

	@ApiProperty()
	price: number;

	@ApiProperty()
	currency: string;

	@ApiProperty()
	quantity: number;

	@ApiProperty()
	categoryId: number;
}
