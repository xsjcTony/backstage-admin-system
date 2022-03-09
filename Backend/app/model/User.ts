/* eslint '@typescript-eslint/explicit-function-return-type': 'off' */

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
  Is,
  IsEmail,
  HasMany,
  Default
} from 'sequelize-typescript'
import { Oauth } from './Oauth'


const { INTEGER, STRING, TINYINT } = DataType

@Table({
  modelName: 'User'
})
export class User extends Model<User> {

  @PrimaryKey
  @AutoIncrement
  @Column(INTEGER.UNSIGNED)
  public id!: number

  @AllowNull(true)
  @Unique(true)
  @Is(/^[A-Za-z0-9]{6,20}$/)
  @Column(STRING)
  public username?: string

  @AllowNull(true)
  @Unique(true)
  @IsEmail
  @Column(STRING)
  public email?: string

  @AllowNull(false)
  @Unique(false)
  @Column(STRING)
  public password?: string

  @AllowNull(false)
  @Unique(false)
  @Default(0)
  @Column(TINYINT.UNSIGNED)
  public github!: number

  @HasMany(() => Oauth)
  public oauths!: Oauth[]

  @CreatedAt
  public createdAt!: Date

  @UpdatedAt
  public updatedAt!: Date
}

export default () => User
