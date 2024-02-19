import { Inject, Injectable } from "@nestjs/common";
import { ORDERS_REPOSITORY } from "./constants";
import { Order } from "./entities/order.entity";
import { CartService } from "../cart/cart.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Product } from "../product/entities/product.entity";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Op } from "sequelize";
import { StatisticsFields } from "../enums/order.enum";

@Injectable()
export class OrderService {
	constructor(@Inject(ORDERS_REPOSITORY) private ordersRepository: typeof Order, private cartService: CartService) {};

	async create(order: CreateOrderDto): Promise<Order> {
		const { userId, products } = order;
		const cart = await this.cartService.getCart(userId);
		if (!cart) {
			throw new Error("CART_NOT_FOUND");
		};
		if (!products.length) {
			throw new Error("CART_IS_EMPTY");
		};
		return this.ordersRepository.create<Order>({ ...order }, { include: [Product] });
	};
	// TODO: response type
	getOrderById(orderId: number): Promise<Order | null> | Error {
		const order = this.ordersRepository.findOne({
			where: { id: orderId },
			include: [Product]
		});
		if (!order) {
			return new Error("ORDER_NOT_FOUND");
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
					throw new Error("Order not found");
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
				// TODO: make clear the response to avoid || []
				totalOrdersCount: (orders || []).length
			})
		};
	};

	private calculateTotalRevenue(orders: Order[]) {
		return orders.reduce((ordersRevenue, order: Order) => {
			const orderRevenue = order.products.reduce((productsRevenue, product) => {
				return product.price + productsRevenue;
			}, 0);
			return orderRevenue + ordersRevenue;
		}, 0);
	};
};
