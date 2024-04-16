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
	userId!: number;

	@HasMany(() => Price, "id")
	items!: Price[];

	@Column
	status: string;

	@HasOne(() => PaymentMethod, "id")
	defaultPaymentMethod?: PaymentMethod;

	@Column
	stripeSubscriptionId: string;
}