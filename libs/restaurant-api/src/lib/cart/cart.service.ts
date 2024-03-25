import {
	BadRequestException,
	Inject,
	Injectable
} from "@nestjs/common";
import { CART_REPOSITORY } from "./constants";
import { Cart } from "./entities/cart.entity";
import { CART_ITEM_NOT_FOUND, CART_NOT_FOUND } from "shared";
import { ItemToUpdateDTO } from "./dto/update-cart-item.dto";
import { Product } from "../product/entities/product.entity";

@Injectable()
export class CartService {
	constructor(@Inject(CART_REPOSITORY) private cartRepository: typeof Cart) {}
	createCart(
		userId: number,
		itemDto: Product,
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
			const relevantItemPrice = item.discountedPrice || item.price;
			cart.totalPrice += item.quantity * relevantItemPrice;
		});
	}

	async addItemToCart(userId: number, itemDto: Product) {
		const {
			id,
			quantity,
			price,
			discountedPrice
		} = itemDto;
		const cart = await this.getCart(userId);

		if (cart) {
			const itemIndex = cart?.items.findIndex((item) => item.id == id);

			if (itemIndex > -1) {
				const item = cart.items[itemIndex];
				item.quantity = Number(item.quantity) + Number(quantity);

				cart.items[itemIndex] = item;
				this.recalculateCart(cart);
				return cart.save();
			} else {
				cart.items.push(itemDto);
				this.recalculateCart(cart);
				return cart.save();
			}
		} else {
			return this.createCart(
				userId,
				itemDto,
				discountedPrice || price
			);
		};
	}

	async updateCart(userId: number, itemToUpdate: ItemToUpdateDTO) {
		const cart = await this.getCart(userId);
		if (!cart) {
			throw new BadRequestException(CART_NOT_FOUND);
		};
		const { quantity: newQuantity, productId } = itemToUpdate;
		const itemIndex = cart?.items.findIndex((item) => item.id == productId);
		if (itemIndex === -1) {
			throw new BadRequestException(CART_ITEM_NOT_FOUND);
		};
		cart.items[itemIndex].quantity = newQuantity;
		this.recalculateCart(cart);
		return cart.save();
	}

	async removeItemFromCart(userId: number, productId: number): Promise<Cart> {
		const cart = await this.getCart(userId);

		if (!cart) {
			throw new BadRequestException(CART_NOT_FOUND);
		};
		const itemIndex = cart?.items.findIndex((item) => item.id == productId);
		if (itemIndex < 0) {
			throw new BadRequestException(CART_ITEM_NOT_FOUND);
		};
		cart?.items.splice(itemIndex, 1);
		this.recalculateCart(cart);
		return cart?.save();
	}
}
