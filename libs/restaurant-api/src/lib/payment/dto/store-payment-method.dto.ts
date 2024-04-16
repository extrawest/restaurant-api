import { ApiProperty } from "@nestjs/swagger";

export class StorePaymentMethodDTO {
	@ApiProperty({ required: true })
	type: string;

	@ApiProperty({ required: true })
	additional_info: {[key: string]: any};
	
	@ApiProperty({ required: true })
	stripeCustomerId: string;
	
	@ApiProperty({ required: true })
	stripePaymentMethodId: string;
}
 
export default StorePaymentMethodDTO;