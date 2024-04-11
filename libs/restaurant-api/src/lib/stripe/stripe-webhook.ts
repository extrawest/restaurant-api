
import {
	Controller,
	Post,
	Headers,
	Req,
	BadRequestException,
	RawBodyRequest
} from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { UsersService } from "../user/user.service";
import { PaymentService } from "../payment/payment.service";
import { paymentEventHandler, subscriptionsEventHandler } from "./webhook-event-handlers";
import { SubscriptionsService } from "../subscriptions/subscriptions.service";
 
@Controller("stripe-webhook")
export default class StripeWebhookController {
	constructor(
		private readonly stripeService: StripeService,
		private readonly paymentService: PaymentService,
		private readonly subscriptionService: SubscriptionsService,
		private readonly usersService: UsersService,
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

		// STRIPE SUBSCRIPTIONS WEBHOOK
		subscriptionsEventHandler(
			event,
			this.subscriptionService,
			this.usersService
		);

		// STRIPE PRODUCTS WEBHOOK
		paymentEventHandler(
			event,
			this.paymentService
		);

		// STRIPE PRICES WEBHOOK

		// STRIPE PAYMENT/PAYMENT-METHOD WEBHOOK
	}
}