import {
	Table,
	Column,
	Model,
	DataType,
	HasOne
} from "sequelize-typescript";
import { Role } from "../../enums/role.enum";
import { UserAdditionalInfo } from "./";

@Table
export class User extends Model {
	@Column
	name: string;

	@Column
	email: string;

	@Column
	password: string;

	@Column({
		defaultValue: Role.Buyer,
		type: DataType.ENUM(...Object.values(Role))
	})
	role: Role;

	@Column
	stripeCustomerId: string;

	@Column
	currentHashedRefreshToken?: string;

	@HasOne(() => UserAdditionalInfo, "id")
	additional_info: UserAdditionalInfo;
}
