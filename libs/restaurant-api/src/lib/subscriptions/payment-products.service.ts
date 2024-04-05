import {
	Inject,
	Injectable,
	NotFoundException
} from "@nestjs/common";
import { PAYMENT_PRODUCT_NOT_FOUND } from "shared";
import { PaymnentProduct } from "./entities";
import { PAYMENT_PRODUCT_REPOSITORY } from "./constants";
import { StripeService } from "../stripe/stripe.service";
import { CreatePaymentProductDTO } from "./dto/create-payment-product.dto";
import { UpdatePaymentProductDTO } from "./dto/update-payment-product.dto";

@Injectable()
export class PaymentProductsService {
	constructor(
		@Inject(PAYMENT_PRODUCT_REPOSITORY) private paymentProductRepository: typeof PaymnentProduct,
		private readonly stripeService: StripeService,
	) {}

	async createPaymentProduct(createPaymentProductDTO: CreatePaymentProductDTO) {
		const { name, description } = createPaymentProductDTO;
		const stripeProduct = await this.stripeService.createProduct(name, description);
		return this.paymentProductRepository.create({
			name: stripeProduct.name,
			description: stripeProduct.description,
			paymentProductId: stripeProduct.id,
		});
	}

	findAllPaymentProducts() {
		return this.paymentProductRepository.findAll();
	}

	findOnePaymentProduct(id: string) {
		return this.paymentProductRepository.findByPk(id);
	}

	async updatePaymentProduct(id: string, updatePaymentProductDTO: UpdatePaymentProductDTO) {
		const paymentProduct = await this.findOnePaymentProduct(id);
		if (!paymentProduct) {
			throw new NotFoundException(PAYMENT_PRODUCT_NOT_FOUND);
		};
		return paymentProduct.update(updatePaymentProductDTO);
	}

	deletePaymentProduct(id: string) {
		return this.paymentProductRepository.destroy({
			where: {
				id
			}
		});
	}
}
