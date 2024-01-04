import { Table, Column, Model, DataType } from 'sequelize-typescript';
import * as bcrypt from "bcrypt";
import { Role } from '../../enums/role.enum';

@Table
export class User extends Model {
  @Column
  name: string;

  @Column
  username: string;

  @Column
  password: string;

  @Column({
    defaultValue: Role.Buyer,
    type: DataType.ENUM(...Object.values(Role)),
  })
  role: Role;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}