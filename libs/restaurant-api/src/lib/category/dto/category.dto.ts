import { ApiProperty } from "@nestjs/swagger";

export class CategoryDTO {
  @ApiProperty()
  name: string;
}
