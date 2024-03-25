import { ApiProperty } from "@nestjs/swagger";
import { Address } from "../entities/order-address.entity";
import { Product } from "../../product/entities/product.entity";

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
