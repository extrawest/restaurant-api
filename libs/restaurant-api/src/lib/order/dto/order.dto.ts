import { ApiProperty } from "@nestjs/swagger";
import { OrderItem } from "../entities/order-item.entity";

export class OrderDTO {
	@ApiProperty()
	userId: number;

	@ApiProperty()
	items: OrderItem[];
}
