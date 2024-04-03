import { ApiProperty } from "@nestjs/swagger";

export class CancelSubscriptionDTO {
	@ApiProperty({ required: true })
	subscriptionId: string;
};