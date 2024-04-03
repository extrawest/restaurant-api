import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Query,
	UseGuards,
	HttpCode,
} from "@nestjs/common";
import { Role } from "../enums/role.enum";
import { Roles } from "../auth/roles.decorator";
import { PaymentService } from "./payment.service";
import { User } from "../decorators/user.decorator";
import { User as UserEntity } from "../user/entities";
import { AuthGuard } from "../auth/guards/auth.guard";
import { StripeService } from "../stripe/stripe.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { CancelPaymentDTO } from "./dto/cancel-payment.dto";
import CreatePaymentMethodDTO from "./dto/create-payment-method.dto";
import { CancelSubscriptionDTO } from "./dto/cancel-subscription.dto";

@Controller("payments")
export class PaymentController {
	constructor(
		private readonly paymentService: PaymentService,
		private readonly stripeService: StripeService,
	) {}

	@UseGuards(AuthGuard)
	@Roles(Role.Buyer)
	@Post("method/create")
	createAndSaveCustomerCardPaymentMethod(
		@Body() createPaymentMethodDTO: CreatePaymentMethodDTO,
		@User() user: UserEntity
	) {
		return this.paymentService.createAndSaveCustomerPaymentMethod(
			user.stripeCustomerId,
			createPaymentMethodDTO.type,
			createPaymentMethodDTO.additional_info,
		);
	}

	@UseGuards(AuthGuard)
	@Roles(Role.Buyer)
	@Get("methods/customer/:customerId")
	getCustomerPaymentMethods(@Param("customerId") customerId: string) {
		return this.paymentService.getCustomerPaymentMethods(customerId);
	}
	
	@UseGuards(AuthGuard)
	@Roles(Role.Buyer)
	@Get("method")
	getCustomerPaymentMethod(
		@Query("customerId") paymentMethodId: string,
		@User() user: UserEntity,
	) {
		return this.paymentService.getCustomerPaymentMethod(user.stripeCustomerId, paymentMethodId);
	}

	@UseGuards(AuthGuard)
	@Roles(Role.Buyer)
	@Post("charge")
	createCharge(
		@Body() createPaymentDto: CreatePaymentDto,
		@User() user: UserEntity
	) {
		return this.paymentService.charge(
			createPaymentDto.amount,
			createPaymentDto.paymentMethodId,
			user.stripeCustomerId
		);
	}

	@UseGuards(AuthGuard)
	@Roles(Role.Buyer, Role.Admin)
	@Get("customer-payments/:customerId")
	getCustomerPayments(@Param("customerId") customerId: string) {
		return this.paymentService.getCustomerPayments(customerId);
	}

	@UseGuards(AuthGuard)
	@Roles(Role.Admin)
	@Get()
	getPayments(
		@Query("limit") limit: number,
		@Query("page") offset: number,
		@Query("stripeCustomerId") stripeCustomerId?: string,
	) {
		return this.paymentService.getPayments(limit, offset, stripeCustomerId);
	}

	@UseGuards(AuthGuard)
	@Roles(Role.Buyer)
	@Post("cancel")
	@HttpCode(204)
	cancelPayment(@Body() cancelPaymentDTO: CancelPaymentDTO) {
		const { paymentId } = cancelPaymentDTO;
		this.paymentService.cancelPayment(paymentId);
	}

	@UseGuards(AuthGuard)
	@Roles(Role.Buyer)
	@Post("cancel-subscription")
	cancelSubscription(@Body() cancelSubscriptionDTO: CancelSubscriptionDTO) {
		return this.paymentService.cancelSubscription(cancelSubscriptionDTO.subscriptionId);
	}
}
