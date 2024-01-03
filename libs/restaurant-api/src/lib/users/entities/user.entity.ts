import { Table, Column, Model } from 'sequelize-typescript';
import * as bcrypt from "bcrypt";

@Table
export class User extends Model {
  @Column
  name: string;

  @Column
  username: string;

  @Column
  password: string;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}