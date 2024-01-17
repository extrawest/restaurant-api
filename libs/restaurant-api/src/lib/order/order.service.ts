import { Inject, Injectable } from '@nestjs/common';
import { ORDERS_REPOSITORY } from './constants';
import { Order } from './entities/order.entity';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from '../product/entities/product.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDERS_REPOSITORY)
    private ordersRepository: typeof Order,
    private cartService: CartService,
  ) {}

  async create(order: CreateOrderDto): Promise<Order | Error> {
    const { userId, products } = order;
    const cart = await this.cartService.getCart(userId);
    if (!cart) {
      return new Error('Cart not found');
    }
    if (!products.length) {
      return new Error('Cart is empty');
    }
    return this.ordersRepository.create<Order>(
      { ...order },
      { include: [Product] },
    );
  }
  // TODO: response type
  getOrderById(orderId: number): Promise<Order | null> | Error {
    const order = this.ordersRepository.findOne({
      where: { id: orderId },
      include: [Product],
    });
    if (!order) {
      return new Error('Order not found');
    } else {
      return order;
    }
  }

  getOrdersByUserId(userId: number): Promise<Order[]> {
    return this.ordersRepository.findAll({
      where: { userId },
      include: [Product],
    });
  }

  update(
    orderId: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order | Error> {
    return this.ordersRepository
      .findOne<Order>({ where: { id: orderId }, include: [Product] })
      .then((item) => {
        if (item) item.update(updateOrderDto);
        return new Error('Order not found');
      });
  }
}
