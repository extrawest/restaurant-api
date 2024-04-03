
import {
	Controller,
	Post,
	Headers,
	Req,
	BadRequestException,
	RawBodyRequest
} from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { PaymentService } from "../payment/payment.service";
 
@Controller("stripe-webhook")
export default class StripeWebhookController {
	constructor(
		private readonly stripeService: StripeService,
		private readonly paymentService: PaymentService,
	) {}
 
	@Post()
	async handleIncomingEvents(
		@Headers("stripe-signature") signature: string,
		@Req() req: RawBodyRequest<Request>
	) {
		if (!signature) {
			throw new BadRequestException("Missing stripe-signature header");
		}

		if (!req.rawBody) {
			throw new BadRequestException("Invalid payload");
		}
		const event = await this.stripeService.constructEventFromPayload(signature, req.rawBody);
		console.log(event);

		if (event.type === "customer.subscription.deleted") {
			const data = event.data.object;
			// data.status
		}
		if (event.type === "product.created") {
			const data = event.data.object;
			// return this.paymentService.
		};

		if (event.type === "price.created") {
			const data = event.data.object;
		};
		// console.log(event)
		// ...
	}
}