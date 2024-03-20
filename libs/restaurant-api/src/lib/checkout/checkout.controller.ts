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
import { AuthGuard } from "../auth/guards/auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { CreateCheckoutDto } from "./dto/create-checkout.dto";

@Controller("checkout")
export class CheckoutController {
	constructor(private readonly checkoutService: CheckoutService) {}

	@Roles(Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@HttpCode(204)
	@Post()
	checkout(@Body() createCheckoutDto: CreateCheckoutDto ,@User() user: UserEntity) {
		const { paymentMethodId, address } = createCheckoutDto;
		this.checkoutService.checkout(paymentMethodId, address, user.id, user.stripeCustomerId);
	}
}
