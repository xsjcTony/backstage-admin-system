/* eslint '@typescript-eslint/no-unsafe-return': 'off' */

import { Service } from 'egg'
import type { User } from '../model/User'
import type { AddUserData } from '../types'
import type { WhereOptions } from 'sequelize'


export default class UserService extends Service {

  /**
   * Get all users from database (REST API - GET)
   * @return {Promise<User[]>}
   */
  public async getAllUsers(): Promise<User[]> {
    const users = await this.ctx.model.User.findAll()
    return users.map((user) => {
      const res = user.toJSON() as User
      delete res.password
      return res
    })
  }


  /**
   * Add user to database (REST API - POST)
   * @param {AddUserData} data
   * @return {Promise<User>}
   */
  public async createUser(data: AddUserData): Promise<User> {
    const { username, email, password } = data

    const user1 = await this._findUser({ username })
    if (user1) {
      throw new Error('Username already exists')
    }

    if (email) {
      const user2 = await this._findUser({ email })
      if (user2) {
        throw new Error('Email already exists')
      }
    }

    const res = await this.ctx.model.User.create({
      username,
      email,
      password: this.ctx.helper.encryptByMd5(password)
    })

    const newUser = res.toJSON() as User
    delete newUser.password

    return newUser
  }


  /**
   * Delete user in database (REST API - DELETE)
   * @param {string} id
   * @return {Promise<User>}
   */
  public async deleteUser(id: string): Promise<User> {
    const user = await this.ctx.model.User.findByPk(id)
    if (user) {
      await user.destroy()
      const res = user.toJSON() as User
      delete res.password
      return res
    } else {
      throw new Error('User doesn\'t exist.')
    }
  }


  /**
   * Helper functions
   */


  /**
   * Look for **ONE** user from database based on given `WHERE` options.
   * @param {WhereOptions} options
   * @return {Promise<User | null>}
   * @private
   */
  private async _findUser(options: WhereOptions): Promise<User | null> {
    return this.ctx.model.User.findOne({ where: options })
  }
}
