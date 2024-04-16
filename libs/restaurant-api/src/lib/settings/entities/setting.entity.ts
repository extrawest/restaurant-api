import { 
	Column, 
	DataType, 
	Model, 
	Table
} from "sequelize-typescript";

@Table
export class Setting extends Model {
	@Column
	name: string;

	@Column({
		type: DataType.JSON,
		get() {
			return JSON.parse(this.getDataValue("data"));
		},
		set(value) {
			return this.setDataValue("data", JSON.stringify(value));
		}
	})
	data: {[key: string]: any};
}
