import { ApiProperty } from "@nestjs/swagger";
import { OrderItem } from "../entities/order-item.entity";
import { Address } from "../entities/order-address.entity";

export class CreateOrderDto {
	@ApiProperty()
	userId: number;

	@ApiProperty()
	items: OrderItem[];

	@ApiProperty()
	paymentId: string;

	@ApiProperty()
	address: Address;
}
