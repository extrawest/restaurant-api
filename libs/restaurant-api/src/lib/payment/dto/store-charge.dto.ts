import { ApiProperty } from "@nestjs/swagger";

export class StoreChargeDTO {
	@ApiProperty()
	amount: number;

	@ApiProperty()
	paymentMethodId?: string;

	@ApiProperty()
	stripeCustomerId?: string;

	@ApiProperty()
	status: string;

	@ApiProperty()
	stripePaymentId?: string;
};