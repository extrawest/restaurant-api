import {
	Table,
	Column,
	Model,
	DataType 
} from "sequelize-typescript";
import { Role } from "../../enums/role.enum";

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
}
