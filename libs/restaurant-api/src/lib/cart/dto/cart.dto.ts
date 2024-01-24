import { ApiProperty } from "@nestjs/swagger";
import { ItemDto } from "./item.dto";

export class CartDTO {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  items: ItemDto[];

  @ApiProperty()
  totalPrice: number;
}