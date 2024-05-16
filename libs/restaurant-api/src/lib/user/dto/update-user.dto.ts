import { ApiProperty } from "@nestjs/swagger";
import { UserAdditionalInfoDTO } from "./user-additional-info.dto";

export class UpdateUserDto {
	@ApiProperty()
  name?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  role?: string;

	@ApiProperty()
	currentHashedRefreshToken?: string;

	@ApiProperty()
	additional_info?: UserAdditionalInfoDTO;
}
