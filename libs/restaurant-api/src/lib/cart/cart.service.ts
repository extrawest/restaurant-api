import {
	BadRequestException,
	Inject,
	Injectable
} from "@nestjs/common";
import { CART_REPOSITORY } from "./constants";
import { Cart } from "./entities/cart.entity";
import { ItemDto } from "./dto/item.dto";
import { CartItem } from "./entities/item.entity";
import { CART_ITEM_NOT_FOUND, CART_NOT_FOUND } from "shared";
import { ItemToUpdateDTO } from "./dto/update-cart-item.dto";

@Injectable()
export class CartService {
	constructor(@Inject(CART_REPOSITORY) private cartRepository: typeof Cart) {}
	createCart(
		userId: number,
		itemDto: ItemDto,
		totalPrice: number
	): Promise<Cart> {
		return this.cartRepository.create<Cart>({
			userId,
			items: [{ ...itemDto }],
			totalPrice
		});
	}

	getCart(userId: number) {
		return this.cartRepository.findOne({ where: { userId } });
	}

	deleteCart(userId: number) {
		return this.cartRepository.destroy({ where: { userId } });
	}

	private recalculateCart(cart: Cart) {
		cart.totalPrice = 0;
		cart.items.forEach((item) => {
			cart.totalPrice += item.quantity * item.price;
		});
	}

	async addItemToCart(userId: number, itemDto: ItemDto) {
		const { productId, quantity, price } = itemDto;
		const cart = await this.getCart(userId);

		if (cart) {
			const itemIndex = cart?.items.findIndex((item) => item.productId == productId);

			if (itemIndex > -1) {
				const item = cart.items[itemIndex];
				item.quantity = Number(item.quantity) + Number(quantity);

				cart.items[itemIndex] = item;
				this.recalculateCart(cart);
				return cart.save();
			} else {
				cart.items.push(itemDto as CartItem);
				this.recalculateCart(cart);
				return cart.save();
			}
		} else {
			return this.createCart(
				userId,
				itemDto,
				price
			);
		};
	}

	async updateCart(userId: number, itemToUpdate: ItemToUpdateDTO) {
		const cart = await this.getCart(userId);
		if (!cart) {
			throw new BadRequestException(CART_NOT_FOUND);
		};
		const { quantity: newQuantity, productId } = itemToUpdate;
		const itemIndex = cart?.items.findIndex((item) => item.productId == productId);
		if (itemIndex === -1) {
			throw new BadRequestException(CART_ITEM_NOT_FOUND);
		};
		cart.items[itemIndex].quantity = newQuantity;
		return cart.save();
	}

	async removeItemFromCart(userId: number, productId: number): Promise<Cart> {
		const cart = await this.getCart(userId);

		if (!cart) {
			throw new BadRequestException(CART_NOT_FOUND);
		};
		const itemIndex = cart?.items.findIndex((item) => item.productId == productId);
		if (itemIndex < 0) {
			throw new BadRequestException(CART_ITEM_NOT_FOUND);
		};
		cart?.items.splice(itemIndex, 1);
		return cart?.save();
	}
}
