import { Service } from 'egg'
import { RegisterData } from '../util/types'
import { WhereOptions } from 'sequelize'
import { User } from '../model/User'


export default class UserService extends Service {

  /**
   * Create user in database.
   * @param {RegisterData} data
   * @return {Promise<void>}
   */
  public async createUser(data: RegisterData): Promise<object> {
    const encryptedPassword = this.ctx.helper.encryptByMd5(data.password)

    if ('username' in data) {
      // Normal Register
      return this._createUserByUsername(data.username, encryptedPassword)
    } else {
      // Email Register
      return this._createUserByEmail(data.email, encryptedPassword)
    }
  }

  /**
   * Look for ONE user from database based on given where options.
   * @param {WhereOptions} options
   * @return {Promise<User | null>}
   * @private
   */
  private async _findUser(options: WhereOptions): Promise<User | null> {
    return this.ctx.model.User.findOne({ where: options })
  }

  /**
   * Create user in database by USERNAME.
   * @param {string} username
   * @param {string} password
   * @return {Promise<object>}
   * @private
   */
  private async _createUserByUsername(username: string, password: string): Promise<object> {
    const user = await this._findUser({ username })
    if (user) {
      throw new Error('Username already exists.')
    }

    const data = await this.ctx.model.User.create({
      username,
      password
    })

    delete data.password

    return data.toJSON()
  }

  /**
   * Create user in database by EMAIL.
   * @param {string} email
   * @param {string} password
   * @return {Promise<object>}
   * @private
   */
  private async _createUserByEmail(email: string, password: string): Promise<object> {
    const user = await this._findUser({ email })
    if (user) {
      throw new Error('Username already exists.')
    }

    const data = await this.ctx.model.User.create({
      email,
      password
    })

    delete data.password

    return data.toJSON()
  }
}
