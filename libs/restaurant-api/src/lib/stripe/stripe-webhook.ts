
import {
	Controller,
	Post,
	Headers,
	Req,
	BadRequestException,
	RawBodyRequest
} from "@nestjs/common";
import {
	paymentEventHandler,
	pricesEventHandler,
	productsEventHandler,
	subscriptionsEventHandler
} from "./webhook-event-handlers";
import { StripeService } from "./stripe.service";
import { UsersService } from "../user/user.service";
import { PaymentService } from "../payment/payment.service";
import { PricesService } from "../subscriptions/prices.service";
import { SubscriptionsService } from "../subscriptions/subscriptions.service";
import { PaymentProductsService } from "../subscriptions/payment-products.service";
 
@Controller("stripe-webhook")
export default class StripeWebhookController {
	constructor(
		private readonly stripeService: StripeService,
		private readonly paymentService: PaymentService,
		private readonly subscriptionService: SubscriptionsService,
		private readonly usersService: UsersService,
		private readonly pricesService: PricesService,
		private readonly paymentProductService: PaymentProductsService,
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
		productsEventHandler(event, this.paymentProductService);

		// STRIPE PRICES WEBHOOK
		pricesEventHandler(event, this.pricesService);

		// STRIPE PAYMENT/PAYMENT-METHOD WEBHOOK
		paymentEventHandler(event, this.paymentService);
	}
}