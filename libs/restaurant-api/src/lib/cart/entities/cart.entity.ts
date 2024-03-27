import {
	Column,
	ForeignKey,
	HasMany,
	Model,
	Table
} from "sequelize-typescript";
import { User } from "../../user/entities";
import { Product } from "../../product/entities";

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
