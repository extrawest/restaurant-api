import {
	BelongsTo,
	Column,
	ForeignKey,
	IsUUID,
	Model,
	PrimaryKey,
	Table,
} from "sequelize-typescript";
import { PaymentMethod } from "./payment-method.entity";

@Table
export class Payment extends Model {
	@IsUUID(4)
  @PrimaryKey
  @Column
	override id: string;

	@Column
	amount!: number;

	@Column
	stripeCustomerId!: string;

	@ForeignKey(() => PaymentMethod)
	@Column
	paymentMethodId!: string;

	@BelongsTo(() => PaymentMethod)
	paymentMethod: PaymentMethod;
}