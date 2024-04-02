import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { UserAdditionalInfoDTO } from "./user-additional-info.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@ApiProperty()
	currentHashedRefreshToken?: string;

	@ApiProperty()
	additional_info?: UserAdditionalInfoDTO;
}
