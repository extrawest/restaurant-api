import Stripe from "stripe";
import { ProductService } from "../../product/product.service";

export const productsEventHandler = async (
	event: Stripe.Event,
	productsService: ProductService,
) => {

};