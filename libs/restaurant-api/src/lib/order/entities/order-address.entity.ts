import {
	Column,
	Model,
	Table
} from "sequelize-typescript";

@Table
export class Address extends Model {
	@Column
	name!: string;

	@Column
	first_address!: string;

	@Column
	second_address?: string;

	@Column
	city!: string;

	@Column
	state!: string;

	@Column
	zip!: string;

	@Column
	country!: string;
}
