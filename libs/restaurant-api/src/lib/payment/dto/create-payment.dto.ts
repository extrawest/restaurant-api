import { ApiProperty } from "@nestjs/swagger";

export class CreatePaymentDto {
	@ApiProperty({ required: true })
	amount: number;

	@ApiProperty({ required: true })
	paymentMethodId: string;
}
