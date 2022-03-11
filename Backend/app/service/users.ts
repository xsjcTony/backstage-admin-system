/* eslint '@typescript-eslint/no-unsafe-return': 'off' */

import { Service } from 'egg'
import type { User } from '../model/User'


export default class UserService extends Service {

  public async getAllUsers(): Promise<User[]> {
    const users = await this.ctx.model.User.findAll()
    return users.map((user) => {
      const res = user.toJSON() as User
      delete res.password
      return res
    })
  }
}
