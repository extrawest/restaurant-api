import Stripe from "stripe";
import { PricesService } from "../../subscriptions/prices.service";

export const pricesEventHandler = async (
	event: Stripe.Event,
	pricesService: PricesService,
) => {

};