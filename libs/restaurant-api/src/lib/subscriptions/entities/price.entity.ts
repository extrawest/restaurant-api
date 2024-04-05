import {
	Column,
	DataType,
	ForeignKey,
	IsUUID,
	Model,
	PrimaryKey,
	Table,
} from "sequelize-typescript";
import { PaymnentProduct } from "./product.entity";
import { Currency } from "../../enums/currency.enum";
import { PaymentInterval } from "../../enums/payment-interval.enum";

@Table
export class Price extends Model {
	@IsUUID(4)
  @PrimaryKey
  @Column
	override id: string;

	@ForeignKey(() => PaymnentProduct)
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

	@Column
	stripePriceId: string;
}