import Stripe from "stripe";
import { PaymentProductsService } from "../../subscriptions/payment-products.service";

export const productsEventHandler = async (
	event: Stripe.Event,
	paymentProductService: PaymentProductsService,
) => {
	if (event.type === "product.created") {
		const { id, name, description } = event.data.object;
		return paymentProductService.storePaymentProduct({
			name,
			description,
			paymentProductId: id,
		});
	};

	if (event.type === "product.updated") {
		const { previous_attributes } = event.data;
		const { id, name, description } = event.data.object;
		const dataToUpdate: {[key: string]: any} = {};
		const product = await paymentProductService.findOnePaymentProductByStripeId(id);

		if (previous_attributes?.name) {
			dataToUpdate.name = name;
		};

		if (previous_attributes?.description) {
			dataToUpdate.description = description;
		};

		if(product && Object.keys(dataToUpdate).length !== 0) {
			return paymentProductService.updatePaymentProduct(product?.id, dataToUpdate);
		}
	};

	if (event.type === "product.deleted") {
		const { id } = event.data.object;
		const product = await paymentProductService.findOnePaymentProductByStripeId(id);

		if (product) {
			return paymentProductService.deletePaymentProduct(product.id);
		};
	};
};