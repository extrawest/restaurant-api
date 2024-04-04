import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete
} from "@nestjs/common";
import { PricesService } from "./prices.service";
import { UpdatePriceDTO } from "./dto/update-price.dto";
import { CreatePriceDTO } from "./dto/create-price.dto";
import { SubscriptionsService } from "./subscriptions.service";
import { PaymentProductsService } from "./payment-products.service";
import { CreateSubscriptionDTO } from "./dto/create-subscription.dto";
import { UpdateSubscriptionDTO } from "./dto/update-subscription.dto";
import { CreatePaymentProductDTO } from "./dto/create-payment-product.dto";

@Controller("subscriptions")
export class SubscriptionsController {
	constructor(
		private readonly subscriptionsService: SubscriptionsService,
		private readonly pricesService: PricesService,
		private readonly paymentProductsService: PaymentProductsService,
	) {}

	@Post()
	createSubscription(@Body() createSubscriptionDTO: CreateSubscriptionDTO) {
		return this.subscriptionsService.createSubscription(createSubscriptionDTO);
	}

	@Get()
	findAllSubscriptions() {
		return this.subscriptionsService.findAllSubscriptions();
	}

	@Get(":id")
	findOneSubscription(@Param("id") id: string) {
		return this.subscriptionsService.findOneSubscription(id);
	}

	@Patch(":id")
	updateSubscription(@Param("id") id: string, @Body() updateSubscriptionDTO: UpdateSubscriptionDTO) {
		return this.subscriptionsService.updateSubscription(id, updateSubscriptionDTO);
	}

	@Post("cancel/:id")
	cancelSubscription(@Param("id") id: string) {
		return this.subscriptionsService.cancelSubscription(id);
	}

	@Post("prices")
	createPrice(@Body() createPriceDTO: CreatePriceDTO) {
		return this.pricesService.createPrice(createPriceDTO);
	}

	@Get("prices")
	findAllPrices() {
		return this.pricesService.findAllPrices();
	}

	@Get("prices/:id")
	findOnePrice(@Param("id") id: string) {
		return this.pricesService.findOnePrice(id);
	}

	@Patch("prices/:id")
	updatePrice(@Param("id") id: string, @Body() updatePriceDTO: UpdatePriceDTO) {
		return this.pricesService.updatePrice(id, updatePriceDTO);
	}

	@Delete("prices/:id")
	deletePrice(@Param("id") id: string) {
		return this.pricesService.deletePrice(id);
	}

	@Post("payment-products")
	createPaymentProduct(@Body() createPaymentProductDTO: CreatePaymentProductDTO) {
		return this.paymentProductsService.createPaymentProduct(createPaymentProductDTO);
	}

	@Get("payment-products")
	findAllPaymentProducts() {
		return this.paymentProductsService.findAllPaymentProducts();
	}

	@Get("payment-products/:id")
	findOnePaymentProduct(@Param("id") id: string) {
		return this.paymentProductsService.findOnePaymentProduct(id);
	}

	@Patch("payment-products/:id")
	updatePaymentProduct(@Param("id") id: string, @Body() updatePriceDTO: UpdatePriceDTO) {
		return this.paymentProductsService.updatePaymentProduct(id, updatePriceDTO);
	}

	@Delete("payment-products/:id")
	deletePaymentProduct(@Param("id") id: string) {
		return this.paymentProductsService.deletePaymentProduct(id);
	}
}
