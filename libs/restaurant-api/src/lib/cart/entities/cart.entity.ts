import { Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "../../user/entities/user.entity";
import { CartItem } from "./item.entity";

@Table
export class Cart extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  @HasMany(() => CartItem) items: CartItem[];

  @Column
  totalPrice: number;
} 