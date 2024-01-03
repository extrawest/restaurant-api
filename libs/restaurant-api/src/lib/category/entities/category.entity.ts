import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class Category extends Model<Category> {
  @Column
  name: string;
}