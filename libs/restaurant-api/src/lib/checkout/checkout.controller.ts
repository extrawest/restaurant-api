import {
	Body,
	Controller,
	HttpCode,
	Post,
	UseGuards
} from "@nestjs/common";
import { CheckoutService } from "./checkout.service";
import { User as UserEntity } from "../user/entities/user.entity";
import { User } from "../decorators/user.decorator";
import { Roles } from "../auth/roles.decorator";
import { Role } from "../enums/role.enum";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/roles.guard";

@Controller("checkout")
export class CheckoutController {
	constructor(private readonly checkoutService: CheckoutService) {}

	@Roles(Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@HttpCode(204)
	@Post()
	checkout(@Body() paymentMethidId: string ,@User() user: UserEntity) {
		this.checkoutService.checkout(paymentMethidId, user.id, user.stripeCustomerId);
	}
}
