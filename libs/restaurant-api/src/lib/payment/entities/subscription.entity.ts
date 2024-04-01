import {
	Column,
	IsUUID,
	Model,
	PrimaryKey,
	Table,
} from "sequelize-typescript";
import { Price } from "./price.entity";
import { PaymentMethod } from "./payment-method.entity";

@Table
export class Subscription extends Model {
	@IsUUID(4)
  @PrimaryKey
  @Column
	override id: string;

	@Column
	customer!: string;

	@Column
	default_payment_method: PaymentMethod;

	@Column
	items!: Price[];
}