import {
	Table,
	Column,
	Model,
} from "sequelize-typescript";

@Table
export class Category extends Model {
	@Column
	name: string;
}
