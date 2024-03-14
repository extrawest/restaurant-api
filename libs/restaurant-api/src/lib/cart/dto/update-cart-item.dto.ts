import { ApiProperty } from "@nestjs/swagger";

export class ItemToUpdateDTO {
  @ApiProperty()
  productId: number;

  @ApiProperty()
  quantity: number;
}