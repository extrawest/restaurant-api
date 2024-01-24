import {
	Body,
	Controller,
	Delete,
	NotFoundException,
	Param,
	Post,
	UseGuards
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { Roles } from "../auth/roles.decorator";
import { Role } from "../enums/role.enum";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { User } from "../decorators/user.decorator";
import { User as UserEntity } from "../user/entities/user.entity";
import { CartDTO } from "./dto/cart.dto";
import { CartItem } from "./entities/item.entity";

@Controller("cart")
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Roles(Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@Post("add-item")
	addItemToCart(@User() user: UserEntity, @Body() itemDTO: CartItem): Promise<CartDTO> {
		const userId = user.id;
		return this.cartService.addItemToCart(userId, itemDTO);
	}

	@Roles(Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@Delete("delete-item")
	async removeItemFromCart(@User() user: UserEntity, @Body() productId: number): Promise<CartDTO> {
		const userId = user.id;
		const cart = await this.cartService.removeItemFromCart(userId, productId);
		if (!cart) throw new NotFoundException("Item does not exist");
		return cart;
	}

	@Roles(Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@Delete(":id")
	async deleteCart(@Param("id") userId: number) {
		const cart = await this.cartService.deleteCart(userId);
		if (!cart) throw new NotFoundException("Cart does not exist");
		return cart;
	}
}
