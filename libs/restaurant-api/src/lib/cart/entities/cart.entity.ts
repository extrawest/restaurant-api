import {
	Column,
	ForeignKey,
	HasMany,
	Model,
	Table
} from "sequelize-typescript";
import { User } from "../../user/entities/user.entity";
import { Product } from "../../product/entities/product.entity";

@Table
export class Cart extends Model {
	@ForeignKey(() => User)
	@Column
	userId: number;

	@HasMany(() => Product)
	items: Product[];

	@Column
	totalPrice: number;
}
