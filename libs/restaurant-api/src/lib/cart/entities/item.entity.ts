import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Product } from "../../product/entities/product.entity";

@Table
export class CartItem extends Model {
  @ForeignKey(() => Product)
  @Column
  productId: number;

  @Column
  name: string;

  @Column
  quantity: number;

  @Column
  price: number;
} 