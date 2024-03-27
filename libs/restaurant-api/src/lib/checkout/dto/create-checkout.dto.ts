import { ApiProperty } from "@nestjs/swagger";
import { Address } from "../../order/entities";

export class CreateCheckoutDto {
	@ApiProperty()
	paymentMethodId: string;

	@ApiProperty()
	address: Address;

	@ApiProperty()
	saveAddress: boolean;
}
