import Stripe from "stripe";
import { PricesService } from "../../subscriptions/prices.service";

export const pricesEventHandler = async (
	event: Stripe.Event,
	pricesService: PricesService,
) => {
	if (event.type === "price.created") {
		const {
			id,
			product,
			unit_amount,
			recurring,
			currency
		} = event.data.object;
		const stripeProductId = typeof product === "string" ? product : product.id;
		return pricesService.storePrice({
			stripeProductId,
			stripePriceId: id,
			unit_amount: unit_amount || undefined,
			interval: recurring?.interval,
			currency,
		});
	};

	if (event.type === "price.deleted") {
		const { id } = event.data.object;
		const price = await pricesService.findOnePriceByStripeId(id);

		if (price) {
			pricesService.deletePrice(price?.id);
		}
	};

	if (event.type === "price.updated") {
		const { previous_attributes } = event.data;
		const { id } = event.data.object;
		const price = await pricesService.findOnePriceByStripeId(id);
		const dataToUpdate: {[key: string]: any} = {};

		if (previous_attributes?.product) {
			const productId = typeof previous_attributes?.product === "string" ? previous_attributes?.product : previous_attributes?.product.id;
			dataToUpdate.productId = productId;
		};

		if (previous_attributes?.unit_amount) {
			dataToUpdate.priceInUSD = previous_attributes?.unit_amount * 100;
		};

		if (previous_attributes?.recurring?.interval) {
			dataToUpdate.interval = previous_attributes?.recurring?.interval;
		};

		if (price && Object.keys(dataToUpdate).length !== 0) {
			return pricesService.updatePrice(price.id, dataToUpdate);
		};
	};
};