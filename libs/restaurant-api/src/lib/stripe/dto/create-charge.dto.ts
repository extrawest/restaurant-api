import { ApiProperty } from "@nestjs/swagger";

export class CreateChargeDto {
	@ApiProperty({ required: true })
	paymentMethodId: string;

	@ApiProperty({ required: true })
	amount: number;
}
 
export default CreateChargeDto;