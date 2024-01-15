import { Inject, Injectable } from '@nestjs/common';
import { CART_REPOSITORY } from './constants';
import { Cart } from './entities/cart.entity';
import { ItemDto } from './dto/item.dto';

@Injectable()
export class CartService {
  constructor(
    @Inject(CART_REPOSITORY)
    private cartRepository: typeof Cart
  ) {}
  createCart(userId: number, itemDto: ItemDto, totalPrice: number): Promise<Cart> {
    return this.cartRepository.create<Cart>({
      userId,
      items: [{ ...itemDto }],
      totalPrice
    })  
  }

  getCart(userId: number) {
    return this.cartRepository.findOne({ where: { userId }})
  }

  deleteCart(userId: number) {
    return this.cartRepository.destroy({ where: { userId }});
  }

  private recalculateCart(cart: Cart) {
    cart.totalPrice = 0;
    cart.items.forEach(item => {
      cart.totalPrice += (item.quantity * item.price);
    })
  }

  async addItemToCart(userId: number, itemDto: ItemDto) {
    const { productId, quantity, price } = itemDto;
    const cart = await this.getCart(userId);

    if (cart) {
      const itemIndex = cart?.items.findIndex((item) => item.productId == productId);

      if (itemIndex > -1) {
        let item = cart.items[itemIndex];
        item.quantity = Number(item.quantity) + Number(quantity);

        cart.items[itemIndex] = item;
        this.recalculateCart(cart);
        return cart.save();
      } else {
        cart.items.push({ ...itemDto });
        this.recalculateCart(cart);
        return cart.save();
      }
    } else {
      return this.createCart(userId, itemDto, price);
    }
  }

  async removeItemFromCart(userId: number, productId: number) {
    const cart = await this.getCart(userId);

    if (!cart) {
      new Error("Cart not found");
    }
    const itemIndex = cart?.items.findIndex((item) => item.productId == productId);

    if (!itemIndex) {
      new Error("Product in the cart not found");
    } else if (itemIndex > -1) {
      cart?.items.splice(itemIndex, 1);
      return cart?.save();
    }
  }
}
