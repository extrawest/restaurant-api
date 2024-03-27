import { ApiProperty } from "@nestjs/swagger";
import { Address } from "../../order/entities";

export class UserAdditionalInfoDTO {
  @ApiProperty()
  address?: Address;
}
