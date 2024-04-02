import {
	BadRequestException,
	HttpStatus,
	Injectable
} from "@nestjs/common";
import {
	CART_IS_EMPTY,
	CART_NOT_FOUND,
	PAYMENT_SUCCESSFULLY_CREATED
} from "shared";
import { Address } from "../order/entities";
import { CartService } from "../cart/cart.service";
import { UsersService } from "../user/user.service";
import { OrderService } from "../order/order.service";
import { ProducerService } from "../queues/queues.producer";
import { PaymentService } from "../payment/payment.service";

@Injectable()
export class CheckoutService {
	constructor(
		private readonly cartService: CartService,
		private readonly queueProducerService: ProducerService,
		private readonly paymentService: PaymentService,
		private readonly ordersService: OrderService,
		private readonly usersService: UsersService,
	) {}
	async checkout(
		paymentMethodId: string, 
		address: Address, 
		userId: number, 
		stripeCustomerId: string,
		saveAddress: boolean = false,
	) {
		const userCart = await this.cartService.getCart(userId);
		if (userCart) {
			const { items, totalPrice: itemsTotalPrice } = userCart;
			if (items?.length && itemsTotalPrice) {
				try {
					const shippingCost = await this.ordersService.calculateShippingCost();
					const totalPrice = shippingCost + itemsTotalPrice;
					const payment = await this.paymentService.charge(totalPrice, paymentMethodId, stripeCustomerId);
					if (payment) {
						await this.queueProducerService.addToOrdersQueue({
							userId,
							items: userCart.items,
							paymentId: payment.id,
							address
						});
						await this.cartService.deleteCart(userId);
						if (saveAddress) {
							this.usersService.update(userId, {
								additional_info: {
									address
								}
							});
						};
					};
				} catch {
					throw new Error();
				}
				return {
					status: HttpStatus.OK,
					message: PAYMENT_SUCCESSFULLY_CREATED
				};
			} else {
				throw new BadRequestException(CART_IS_EMPTY);
			};
		} else {
			throw new BadRequestException(CART_NOT_FOUND);
		};
	}
}
