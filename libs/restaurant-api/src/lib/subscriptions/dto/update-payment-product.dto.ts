import { PartialType } from "@nestjs/mapped-types";
import { CreatePaymentProductDTO } from "./create-payment-product.dto";

export class UpdatePaymentProductDTO extends PartialType(CreatePaymentProductDTO) {}
