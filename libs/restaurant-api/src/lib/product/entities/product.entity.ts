import {
	Table,
	Column,
	Model,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import { Cart } from "../../cart/entities";
import { Category } from "../../category/entities";

@Table
export class Product extends Model {
	@Column
	name: string;

	@Column
	image: string;

	@Column
	price: number;

	@Column
	discountedPrice: number;

	@Column
	currency: string;

	@Column
	quantity: number;

	@ForeignKey(() => Category)
	@Column
	categoryId!: number;

	@BelongsTo(() => Category)
	category: Category;

	@ForeignKey(() => Cart)
	carts: Cart[];
}
