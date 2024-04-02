import {
	Body,
	Controller,
	HttpCode,
	Post,
	UseGuards
} from "@nestjs/common";
import { Role } from "../enums/role.enum";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { User } from "../decorators/user.decorator";
import { CheckoutService } from "./checkout.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { CreateCheckoutDto } from "./dto/create-checkout.dto";
import { User as UserEntity } from "../user/entities";

@Controller("checkout")
export class CheckoutController {
	constructor(private readonly checkoutService: CheckoutService) {}

	@Roles(Role.Buyer)
	@UseGuards(AuthGuard, RolesGuard)
	@HttpCode(204)
	@Post()
	checkout(@Body() createCheckoutDto: CreateCheckoutDto ,@User() user: UserEntity) {
		const { paymentMethodId, address, saveAddress } = createCheckoutDto;
		this.checkoutService.checkout(
			paymentMethodId, 
			address, 
			user.id, 
			user.stripeCustomerId, 
			saveAddress
		);
	}
}
