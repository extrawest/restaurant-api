import {
	Body,
	Controller,
	Delete,
	NotFoundException,
	Param,
	Post,
	Request,
	UseGuards
} from "@nestjs/common";
import { CartService } from "./cart.service";
import { ItemDto } from "./dto/item.dto";
import { Roles } from "../auth/roles.decorator";
import { Role } from "../enums/role.enum";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/roles.guard";

@Controller("cart")
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Roles(Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@Post("add-item")
	// TODO: request custom type
	/* eslint-disable @typescript-eslint/no-explicit-any */
	addItemToCart(@Request() req: any, @Body() itemDTO: ItemDto) {
		const userId = req.user.sub;
		return this.cartService.addItemToCart(userId, itemDTO);
	}

	@Roles(Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@Delete("delete-item")
	/* eslint-disable @typescript-eslint/no-explicit-any */
	async removeItemFromCart(@Request() req: any, @Body() productId: number) {
		const userId = req.user.sub;
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
