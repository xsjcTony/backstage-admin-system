/* eslint '@typescript-eslint/explicit-function-return-type': 'off' */
/* eslint '@typescript-eslint/no-unsafe-assignment': 'off' */
/* eslint '@typescript-eslint/no-unsafe-argument': 'off' */
/* eslint '@typescript-eslint/no-unsafe-member-access': 'off' */

import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  AllowNull,
  Unique,
  CreatedAt,
  UpdatedAt,
  ForeignKey
} from 'sequelize-typescript'
import { Role } from './Role'
import { User } from './User'


const { INTEGER } = DataType

@Table({
  modelName: 'UserRole'
})
export class UserRole extends Model<UserRole> {

  @PrimaryKey
  @AutoIncrement
  @Column(INTEGER.UNSIGNED)
  public id!: number

  @ForeignKey(() => User)
  @AllowNull(false)
  @Unique(false)
  @Column(INTEGER.UNSIGNED)
  public userId!: number

  @ForeignKey(() => Role)
  @AllowNull(false)
  @Unique(false)
  @Column(INTEGER.UNSIGNED)
  public roleId!: number

  @CreatedAt
  public createdAt?: Date

  @UpdatedAt
  public updatedAt?: Date
}

export default () => UserRole
