import { Op } from "sequelize";
import { Maybe } from "utils";
import {
	CART_IS_EMPTY,
	CART_NOT_FOUND,
	ORDER_NOT_FOUND
} from "shared";
import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException
} from "@nestjs/common";
import { Order } from "./entities";
import { Product } from "../product/entities";
import { ORDERS_REPOSITORY } from "./constants";
import { CartService } from "../cart/cart.service";
import { StatisticsFields } from "../enums/order.enum";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { SettingsService } from "../settings/settings.service";

@Injectable()
export class OrderService {
	constructor(
		@Inject(ORDERS_REPOSITORY) private ordersRepository: typeof Order,
		private readonly cartService: CartService,
		private readonly settingsService: SettingsService,
	) {};

	async create(order: CreateOrderDto): Promise<Order> {
		const { userId, items } = order;
		const cart = await this.cartService.getCart(userId);
		if (!cart) {
			throw new BadRequestException(CART_NOT_FOUND);
		};
		if (!items.length) {
			throw new BadRequestException(CART_IS_EMPTY);
		};
		return this.ordersRepository.create<Order>({ ...order }, { include: [Product] });
	};
	// TODO: response type
	getOrderById(orderId: number): Promise<Order | null> {
		const order = this.ordersRepository.findOne({
			where: { id: orderId },
			include: [Product]
		});
		if (!order) {
			throw new NotFoundException(ORDER_NOT_FOUND);
		} else {
			return order;
		}
	};

	findAll(fromDate?: string, toDate?: string): Promise<Order[]> {
		return this.ordersRepository.findAll({
			where: {
				...(fromDate && toDate && {
					createdAt: {
						[Op.and]: {
							[Op.gte]: new Date(fromDate),
							[Op.lte]: new Date(toDate)
						}
					}
				})
			}
		});
	};

	getOrdersByUserId(userId: number): Promise<Order[]> {
		return this.ordersRepository.findAll({
			where: { userId },
			include: [Product]
		});
	};

	update(orderId: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
		return this.ordersRepository
			.findOne<Order>({ where: { id: orderId }, include: [Product] })
			.then((item) => {
				if (item) {
					return item.update(updateOrderDto);
				} else {
					throw new NotFoundException(ORDER_NOT_FOUND);
				};
			});
	};

	async getStatistics(
		fields: StatisticsFields[],
		fromDate?: string,
		toDate?: string
	) {
		const orders = await this.findAll(fromDate, toDate);

		return {
			...(fields.includes(StatisticsFields.TOTAL_REVENUE) && {
				totalRevenue: this.calculateTotalRevenue(orders)
			}),
			...(fields.includes(StatisticsFields.TOTAL_ORDERS) && {
				totalOrdersCount: orders.length
			})
		};
	};

	private calculateTotalRevenue(orders: Order[]) {
		return orders.reduce((ordersRevenue, order: Order) => {
			const orderRevenue = order.items.reduce((productsRevenue, product) => {
				const relevantPrice = product.discountedPrice || product.price;
				return relevantPrice + productsRevenue;
			}, 0);
			return orderRevenue + ordersRevenue;
		}, 0);
	};

	getOrderByPaymentId(paymentId: string): Promise<Maybe<Order>> {
		return this.ordersRepository.findOne({
			where: { paymentId }
		});
	}

	async calculateShippingCost() {
		const shippingPrice = await this.settingsService.findOneByName("shippingPrice");
		return shippingPrice?.data["value"] || 0;
	}
};
