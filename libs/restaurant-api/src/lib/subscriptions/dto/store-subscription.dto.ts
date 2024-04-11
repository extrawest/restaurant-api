import { ApiProperty } from "@nestjs/swagger";

export class StoreSubscriptionDTO {
	@ApiProperty()
	userId: number;

	@ApiProperty()
	priceIds: string[];

	@ApiProperty()
	defaultPaymentMethodId?: string;

	@ApiProperty()
	status: string;

	@ApiProperty()
	stripeSubscriptionId: string;
}
