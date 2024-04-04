import {
	Column,
	HasMany,
	HasOne,
	IsUUID,
	Model,
	PrimaryKey,
	Table,
} from "sequelize-typescript";
import { Price } from "./price.entity";
import { PaymentMethod } from "../../payment/entities/payment-method.entity";

@Table
export class Subscription extends Model {
	@IsUUID(4)
  @PrimaryKey
  @Column
	override id: string;

	@Column
	customer!: string;

	@HasOne(() => PaymentMethod, "id")
	defaultPaymentMethod: PaymentMethod;

	@HasMany(() => Price, "id")
	items!: Price[];

	@Column
	status: string;

	@Column
	stripeSubscriptionId?: string;
}