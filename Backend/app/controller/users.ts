/* eslint '@typescript-eslint/no-unsafe-assignment': 'off' */
/* eslint '@typescript-eslint/no-unsafe-argument': 'off' */

/**
 * imports
 */
import { Controller } from 'egg'
import AddUserRule from '../validator/addUserRule'


/**
 * controller
 */
export default class UsersController extends Controller {

  public async getUsers(): Promise<void> {
    const { ctx } = this

    try {
      const users = await ctx.service.users.getAllUsers()
      ctx.success(200, 'success', users)
    } catch (err) {
      if (err instanceof Error) {
        ctx.error(500, err.message, err)
      }
    }
  }


  public async createUser(): Promise<void> {
    const { ctx } = this
    const data = ctx.request.body

    try {
      // validate
      ctx.validate(AddUserRule, data)

      // save into database
      const user = await ctx.service.users.createUser(data)

      ctx.success(200, 'User has been added', user)
    } catch (err) {
      if (err instanceof Error) {
        ctx.error(400, err.message, err)
      } else {
        ctx.error(400, 'error', err)
      }
    }
  }
}
