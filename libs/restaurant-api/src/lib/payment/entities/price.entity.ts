import {
	Column,
	DataType,
	ForeignKey,
	IsUUID,
	Model,
	PrimaryKey,
	Table,
} from "sequelize-typescript";
import { PaymentInterval } from "../../enums/payment-interval.enum";
import { Currency } from "../../enums/currency.enum";
import { StripeProduct } from "./product.entity";

@Table
export class Price extends Model {
	@IsUUID(4)
  @PrimaryKey
  @Column
	override id: string;

	@ForeignKey(() => StripeProduct)
	product!: string;
	
	@Column
	unit_amount: number;

	@Column({
		type: DataType.ENUM({
			values: Object.values(PaymentInterval)
		})
	})
	interval: string;

	@Column({
		type: DataType.ENUM({
			values: Object.values(Currency)
		})
	})
	currency: string;
}