import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateOrderDto } from "./create-order.dto";
import { Status as OrderStatus } from "../../enums/order.enum";

export class UpdateOrderDto extends PartialType(OmitType(CreateOrderDto, ["userId"])) {
	status: OrderStatus;
}
