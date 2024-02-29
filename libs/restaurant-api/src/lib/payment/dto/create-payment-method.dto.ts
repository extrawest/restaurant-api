import { ApiProperty } from "@nestjs/swagger";

export class CreatePaymentMethodDto {
	@ApiProperty({ required: true })
	type: string;

	@ApiProperty({ required: true })
	additional_info: JSON;
}
 
export default CreatePaymentMethodDto;