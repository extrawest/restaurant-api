import {
	Inject,
	Injectable,
	NotFoundException
} from "@nestjs/common";
import { PAYMENT_PRODUCT_NOT_FOUND, PRICE_NOT_FOUND } from "shared";
import { Price } from "./entities";
import { PRICE_REPOSITORY } from "./constants";
import { CreatePriceDTO } from "./dto/create-price.dto";
import { UpdatePriceDTO } from "./dto/update-price.dto";
import { StripeService } from "../stripe/stripe.service";
import { PaymentProductsService } from "./payment-products.service";

@Injectable()
export class PricesService {
	constructor(
		@Inject(PRICE_REPOSITORY) private priceRepository: typeof Price,
		private readonly paymentProductService: PaymentProductsService,
		private readonly stripeService: StripeService,
	) {}

	async createPrice(createPriceDTO: CreatePriceDTO) {
		const { productId, priceInUSD, interval } = createPriceDTO;
		const paymentProduct = await this.paymentProductService.findOnePaymentProduct(productId);
		if (!paymentProduct) {
			throw new NotFoundException(PAYMENT_PRODUCT_NOT_FOUND);
		};
		const price = await this.stripeService.createPrice(paymentProduct.paymentProductId, priceInUSD, interval);
		return this.priceRepository.create({
			product: paymentProduct.id,
			unit_amount: price.unit_amount,
			interval: price.recurring?.interval,
			currency: price.currency,
			stripePriceId: price.id,
		});
	}

	findAllPrices() {
		return this.priceRepository.findAll();
	}

	findAllByIds(ids: string[]) {
		return this.priceRepository.findAll({
			where: {
				id: ids
			}
		});
	}

	findOnePrice(id: string) {
		return this.priceRepository.findByPk(id);
	}

	findPricesByProductId(productId: string) {
		return this.priceRepository.findAll({
			where: {
				product: productId
			}
		});
	}

	async updatePrice(id: string, updatePriceDTO: UpdatePriceDTO) {
		const price = await this.findOnePrice(id);
		if (!price) {
			throw new NotFoundException(PRICE_NOT_FOUND);
		};
		return price.update(updatePriceDTO);
	}

	deletePrice(id: string) {
		return this.priceRepository.destroy({
			where: {
				id
			}
		});
	}
}
