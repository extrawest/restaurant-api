import {
	Column,
	ForeignKey,
	Model,
	Table
} from "sequelize-typescript";
import { Product } from "../../product/entities/product.entity";
import { Cart } from "./cart.entity";

@Table
export class CartItem extends Model {
	@ForeignKey(() => Product)
	@Column
	productId: number;

	@Column
	name: string;

	@Column
	quantity: number;

	@Column
	price: number;

	@ForeignKey(() => Cart)
	@Column
	cartId!: number;
}
