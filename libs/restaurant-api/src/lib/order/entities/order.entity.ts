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
import { OrderItem } from "./order-item.entity";

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

	@HasMany(() => OrderItem)
	items: OrderItem[];

	@Column
	paymentId!: string;
}
