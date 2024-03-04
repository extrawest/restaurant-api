import {
	BadRequestException,
	HttpStatus,
	Injectable
} from "@nestjs/common";
import { CartService } from "../cart/cart.service";
import { ProducerService } from "../queues/queues.producer";
import { PaymentService } from "../payment/payment.service";

@Injectable()
export class CheckoutService {
	constructor(
		private readonly cartService: CartService,
		private readonly queueProducerService: ProducerService,
		private readonly paymentService: PaymentService,
	) {}
	async checkout(paymentMethodId: string, userId: number, stripeCustomerId: string) {
		const userCart = await this.cartService.getCart(userId);
		if (userCart) {
			const { items, totalPrice } = userCart;
			if (items?.length && totalPrice) {
				try {
					const payment = await this.paymentService.charge(totalPrice, paymentMethodId, stripeCustomerId);
					if (payment) {
						await this.queueProducerService.addToOrdersQueue({
							userId,
							items: userCart.items,
							paymentId: payment.id
						});
						await this.cartService.deleteCart(userId);
					};
				} catch {
					throw new Error();
				}
				return {
					status: HttpStatus.OK,
					message: "PAYMENT_SUCCESSFULLY_CREATED"
				};
			} else {
				throw new BadRequestException("CART_IS_EMPTY");
			};
		} else {
			throw new BadRequestException("CART_NOT_FOUND");
		};
	}
}
