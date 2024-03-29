import { ApiProperty } from "@nestjs/swagger";

export class CreateSettingDto {
	@ApiProperty({ required: true })
	name: string;

	@ApiProperty({ required: true })
	data: {[key: string]: any};
}
 
export default CreateSettingDto;