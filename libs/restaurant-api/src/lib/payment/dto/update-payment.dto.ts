import { ApiProperty } from "@nestjs/swagger";

export class UpdatePaymentDTO {
	@ApiProperty()
	status: string;
};