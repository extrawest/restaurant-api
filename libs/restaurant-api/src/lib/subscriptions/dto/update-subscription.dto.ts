import { ApiProperty, OmitType } from "@nestjs/swagger";
import { PartialType } from "@nestjs/mapped-types";
import { CreateSubscriptionDTO } from "./create-subscription.dto";

export class UpdateSubscriptionDTO extends PartialType(OmitType(CreateSubscriptionDTO, ["userId"])) {
	@ApiProperty()
	status: string;
}
