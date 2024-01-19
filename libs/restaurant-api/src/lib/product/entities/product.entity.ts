import {
	Table,
	Column,
	Model,
	ForeignKey,
	BelongsTo
} from "sequelize-typescript";
import { Category } from "../../category/entities/category.entity";

@Table
export class Product extends Model {
	@Column
	name: string;

	@Column({
		type: "bytea"
	})
	image: Uint8Array;

	@Column
	price: number;

	@Column
	currency: string;

	@Column
	quantity: number;

	@ForeignKey(() => Category)
	@Column
	categoryId!: number;

	@BelongsTo(() => Category)
	category: Category;
}
