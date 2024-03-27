import { ApiProperty } from "@nestjs/swagger";
import { Address } from "../entities";
import { Product } from "../../product/entities";

export class CreateOrderDto {
	@ApiProperty()
	userId: number;

	@ApiProperty()
	items: Product[];

	@ApiProperty()
	paymentId: string;

	@ApiProperty()
	address: Address;
}
