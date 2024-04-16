import { ApiProperty } from "@nestjs/swagger";
import { PaymentInterval } from "../../enums/payment-interval.enum";

export class CreatePriceDTO {
	@ApiProperty()
	productId: string;

	@ApiProperty()
	priceInUSD: number;

	@ApiProperty()
	interval: PaymentInterval;
}
