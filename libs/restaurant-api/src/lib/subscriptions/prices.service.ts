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
import { StorePriceDTO } from "./dto/store-price.dto";

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
		return this.stripeService.createPrice(paymentProduct.stripeProductId, priceInUSD, interval);
	}

	storePrice(storePriceDTO: StorePriceDTO) {
		const {
			stripeProductId,
			unit_amount,
			interval,
			currency,
			stripePriceId,
		} = storePriceDTO;
		const product = this.paymentProductService.findOnePaymentProductByStripeId(stripeProductId);
		return this.priceRepository.create({
			product,
			unit_amount: unit_amount,
			interval,
			currency: currency,
			stripePriceId,
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

	findOnePriceByStripeId(stripePriceId: string) {
		return this.priceRepository.findOne({
			where: {
				stripePriceId
			}
		});
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
