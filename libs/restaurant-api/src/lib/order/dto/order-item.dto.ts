import { ApiProperty } from "@nestjs/swagger";

export class OrderItemDTO {
  @ApiProperty()
  productId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;
  
  @ApiProperty()
  price: number;

  @ApiProperty()
  discountedPrice?: number;
};