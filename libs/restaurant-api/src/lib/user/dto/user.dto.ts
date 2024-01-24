import { ApiProperty } from "@nestjs/swagger";

export class UserDTO {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  role!: string;
}
