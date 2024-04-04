import { Inject, Injectable } from "@nestjs/common";
import { PaymnentProduct } from "./entities";
import { PAYMENT_PRODUCT_REPOSITORY } from "./constants";
import { CreatePaymentProductDTO } from "./dto/create-payment-product.dto";
import { UpdatePaymentProductDTO } from "./dto/update-payment-product.dto";

@Injectable()
export class PaymentProductsService {
	constructor(
		@Inject(PAYMENT_PRODUCT_REPOSITORY) private paymentProductRepository: typeof PaymnentProduct,
	) {}

	async createPaymentProduct(createPaymentProductDTO: CreatePaymentProductDTO) {
		// create payment product in stripe
		// create payment product in our DB
	}

	findAllPaymentProducts() {
		return `This action returns all payment products`;
	}

	findOnePaymentProduct(id: string) {
		return `This action returns a #${id} payment products`;
	}

	updatePaymentProduct(id: string, updatePaymentProductDTO: UpdatePaymentProductDTO) {
		return "";
	}

	deletePaymentProduct(id: string) {
		return `This action removes a #${id} payment product`;
	}
}
