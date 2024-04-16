import { ApiProperty } from "@nestjs/swagger";

export class CreateSubscriptionDTO {
	@ApiProperty()
	userId: number;

	@ApiProperty()
	priceIds: string[];

	@ApiProperty()
	defaultPaymentMethodId?: string;
}
