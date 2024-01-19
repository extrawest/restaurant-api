import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey,
	BelongsTo,
	HasMany
} from "sequelize-typescript";
import { Status as OrderStatus } from "../../enums/order.enum";
import { User } from "../../user/entities/user.entity";
import { Product } from "../../product/entities/product.entity";

@Table
export class Order extends Model {
	@Column({
		defaultValue: OrderStatus.Created,
		type: DataType.ENUM(...Object.values(OrderStatus))
	})
	status!: OrderStatus;

	@ForeignKey(() => User)
	@Column
	userId!: number;

	@BelongsTo(() => User)
	user: User;

	@HasMany(() => Product)
	products: Product[];
}
