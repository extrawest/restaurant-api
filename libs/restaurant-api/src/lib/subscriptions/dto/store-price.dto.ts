import { ApiProperty } from "@nestjs/swagger";
import Stripe from "stripe";
import { Maybe } from "utils";

export class StorePriceDTO {
	@ApiProperty()
	stripeProductId: string;

	@ApiProperty()
	unit_amount?: number;
	
	@ApiProperty()
	interval?: Maybe<Stripe.Price.Recurring.Interval>;

	@ApiProperty()
	currency: string;

	@ApiProperty()
	stripePriceId: string;
};