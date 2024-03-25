import { ApiProperty } from "@nestjs/swagger";
import { Address } from "../../order/entities/order-address.entity";

export class UserAdditionalInfoDTO {
  @ApiProperty()
  address?: Address;
}
