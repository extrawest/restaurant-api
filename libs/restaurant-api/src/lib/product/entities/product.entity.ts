import {
	Table,
	Column,
	Model,
	ForeignKey,
	BelongsTo,
	BelongsToMany
} from "sequelize-typescript";
import { Category } from "../../category/entities/category.entity";
import { Order } from "../../order/entities/order.entity";
import { Cart } from "../../cart/entities/cart.entity";

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
	// @BelongsTo(() => Cart)
	carts: Cart[];
}
