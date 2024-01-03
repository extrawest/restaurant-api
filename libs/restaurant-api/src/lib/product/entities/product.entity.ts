import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class Product extends Model<Product> {
  @Column
  name: string;

  @Column({
    type: 'bytea',
  })
  image: Uint8Array;

  @Column
  price: number;

  @Column
  currency: string;

  @Column
  quantity: number;
}