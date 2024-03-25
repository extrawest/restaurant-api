import {
	Table,
	Column,
	Model,
	DataType,
	ForeignKey,
	BelongsTo,
	HasOne
} from "sequelize-typescript";
import { Status as OrderStatus } from "../../enums/order.enum";
import { User } from "../../user/entities/user.entity";
import { Address } from "./order-address.entity";
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

	@Column({
		type: DataType.ARRAY(DataType.JSONB),
		allowNull: false,
	})
	items: Product[];

	@Column
	paymentId!: string;

	@HasOne(() => Address, "id")
	address!: Address;
}
