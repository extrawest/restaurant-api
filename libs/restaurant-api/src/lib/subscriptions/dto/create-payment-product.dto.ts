import { ApiProperty } from "@nestjs/swagger";

export class CreatePaymentProductDTO {
	@ApiProperty()
	name: string;

	@ApiProperty()
	description?: string;
}
