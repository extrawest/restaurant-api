import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	NotFoundException,
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
import { ItemDto } from "./dto/item.dto";
import { CartItem } from "./entities/item.entity";

@Controller("cart")
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Roles(Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@Post("add-item")
	addItemToCart(@User() user: UserEntity, @Body() itemDTO: ItemDto): Promise<CartDTO> {
		const userId = user.id;
		return this.cartService.addItemToCart(userId, itemDTO);
	}

	@Roles(Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@Get()
	getCart(@User() user: UserEntity): Promise<CartDTO | null> {
		const userId = user.id;
		return this.cartService.getCart(userId);
	}

	@Roles(Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@Delete("delete-item")
	async removeItemFromCart(@User() user: UserEntity, @Body() productId: number): Promise<CartDTO> {
		const userId = user.id;
		const cart = await this.cartService.removeItemFromCart(userId, productId);
		if (!cart) throw new NotFoundException("CART_DOESNT_EXIST");
		return cart;
	}

	@Roles(Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@Delete()
	async deleteCart(@User() user: UserEntity) {
		const userId = user.id;
		const cart = await this.cartService.deleteCart(userId);
		if (cart) {
			return {
				status: HttpStatus.OK,
				message: "CART_WAS_DELETED"
			};
		} else {
			return {
				status: HttpStatus.BAD_REQUEST,
				message: "CART_WASN'T_DELETED"
			};
		};
	}
}
