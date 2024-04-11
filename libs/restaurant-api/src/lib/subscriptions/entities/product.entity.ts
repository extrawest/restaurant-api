import {
	Column,
	IsUUID,
	Model,
	PrimaryKey,
	Table,
} from "sequelize-typescript";

@Table
export class PaymnentProduct extends Model {
	@IsUUID(4)
  @PrimaryKey
  @Column
	override id: string;

	@Column
	name!: string;

	@Column
	description: string;

	//TODO: rename to stripeProductId
	@Column
	paymentProductId: string;
}