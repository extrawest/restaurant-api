import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../../product/entities/product.entity";

export class CartDTO {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  items: Product[];

  @ApiProperty()
  totalPrice: number;
}