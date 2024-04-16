import {
	Column,
	DataType,
	IsUUID,
	Model,
	PrimaryKey,
	Table
} from "sequelize-typescript";

@Table
export class PaymentMethod extends Model {
	@IsUUID(4)
  @PrimaryKey
  @Column
	override id: string;

	@Column
	type: string;

	@Column({
		type: DataType.JSON,
		get() {
			return JSON.parse(this.getDataValue("additional_info"));
		},
		set(value) {
			return this.setDataValue("additional_info", JSON.stringify(value));
		}
	})
	additional_info: {[key: string]: any};

	@Column
	stripePaymentMethodId: string;

	@Column
	stripeCustomerId: string;
}