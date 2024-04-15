import { ApiProperty } from "@nestjs/swagger";
import { Maybe } from "utils";

export class StorePaymentProductDTO {
	@ApiProperty()
	name: string;

	@ApiProperty()
	description: Maybe<string>;

	@ApiProperty()
	paymentProductId: string;
};