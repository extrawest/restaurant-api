import {
	HasOne,
	Model,
	Table
} from "sequelize-typescript";
import { Address } from "../../order/entities";

@Table
export class UserAdditionalInfo extends Model {
	@HasOne(() => Address, "id")
	address: Address;
};