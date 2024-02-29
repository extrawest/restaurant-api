import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Query,
	UseGuards
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import CreatePaymentMethodDTO from "./dto/create-payment-method.dto";
import { AuthGuard } from "../auth/auth.guard";
import { Roles } from "../auth/roles.decorator";
import { Role } from "../enums/role.enum";
import { User as UserEntity } from "../user/entities/user.entity";
import { User } from "../decorators/user.decorator";

@Controller("payment")
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	// TODO: save payment methods in the DB
	@UseGuards(AuthGuard)
	@Roles(Role.Buyer)
	@Post("payment-method/create-and-attach")
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
	@Get("payment-methods/customer/:customerId")
	getCustomerPaymentMethods(@Param("customerId") customerId: string) {
		return this.paymentService.getCustomerPaymentMethods(customerId);
	}
	
	@UseGuards(AuthGuard)
	@Roles(Role.Buyer)
	@Get("payment-method")
	getCustomerPaymentMethod(
		@Query("customerId") paymentMethodId: string,
		@User() user: UserEntity,
	) {
		return this.paymentService.getCustomerPaymentMethod(user.stripeCustomerId, paymentMethodId);
	}

	// TODO: save payment in the DB
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

	@Get("payments/customer-payments/:customerId")
	getCustomerPayments(@Param("customerId") customerId: string) {
		return this.paymentService.getCustomerPayments(customerId);
	}

	@Get("payments")
	getPayments(
		@Query("query") query?: string,
		@Query("limit") limit?: number,
		@Query("page") page?: string,
	) {
		return this.paymentService.getPayments(query, limit, page);
	}
}
