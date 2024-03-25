import { ApiProperty } from "@nestjs/swagger";
import { Address } from "../../order/entities/order-address.entity";

export class CreateCheckoutDto {
	@ApiProperty()
	paymentMethodId: string;

	@ApiProperty()
	address: Address;

	@ApiProperty()
	saveAddress: boolean;
}
