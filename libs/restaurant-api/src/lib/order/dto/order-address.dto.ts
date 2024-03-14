import { ApiProperty } from "@nestjs/swagger";

export class AddressDTO {
	@ApiProperty()
	name!: string;

	@ApiProperty()
	first_address!: string;

	@ApiProperty()
	second_address: string;

	@ApiProperty()
	city!: string;

	@ApiProperty()
	state!: string;

	@ApiProperty()
	zip!: string;

	@ApiProperty()
	country!: string;
}
