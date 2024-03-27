import { ApiProperty } from "@nestjs/swagger";

export class CreateSettingDto {
	@ApiProperty({ required: true })
	name: string;

	@ApiProperty({ required: true })
	data: JSON;
}
 
export default CreateSettingDto;