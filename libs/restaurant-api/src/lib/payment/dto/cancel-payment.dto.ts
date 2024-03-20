import { ApiProperty } from "@nestjs/swagger";

export class CancelPaymentDTO {
	@ApiProperty({ required: true })
	paymentId: string;
};