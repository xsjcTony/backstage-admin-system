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
  Default,
  BelongsToMany
} from 'sequelize-typescript'
import { User } from './User'
import { UserRole } from './UserRole'


const { INTEGER, STRING, BOOLEAN } = DataType

@Table({
  modelName: 'Role'
})
export class Role extends Model<Role> {

  @PrimaryKey
  @AutoIncrement
  @Column(INTEGER.UNSIGNED)
  public id!: number

  @AllowNull(false)
  @Unique(true)
  // @Is(/^(?!\s*$).+/)
  @Column(STRING)
  public roleName!: string

  @AllowNull(false)
  @Unique(true)
  // @Is(/^(?!\s*$).+/)
  @Column(STRING)
  public description!: string

  @AllowNull(false)
  @Unique(false)
  @Default(true)
  @Column(BOOLEAN)
  public roleState!: boolean

  @BelongsToMany(() => User, () => UserRole)
  public users!: (User & { UserRole: UserRole })[]

  @CreatedAt
  public createdAt?: Date

  @UpdatedAt
  public updatedAt?: Date
}

export default () => Role
