/* eslint '@typescript-eslint/no-unsafe-assignment': 'off' */
/* eslint '@typescript-eslint/no-unsafe-argument': 'off' */
/* eslint '@typescript-eslint/no-unsafe-member-access': 'off' */

/**
 * imports
 */
import { Controller } from 'egg'
import AddUserRule from '../validator/addUserRule'


/**
 * controller
 */
export default class UsersController extends Controller {

  public async getAllUsers(): Promise<void> {
    const { ctx } = this

    try {
      const users = await ctx.service.users.getAllUsers()
      ctx.success(200, 'success', users)
    } catch (err) {
      if (err instanceof Error) {
        ctx.error(500, err.message, err)
      } else {
        ctx.error(500, 'Error', err)
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
        ctx.error(400, 'Error', err)
      }
    }
  }


  public async deleteUser(): Promise<void> {
    const { ctx } = this

    try {
      const user = await ctx.service.users.deleteUser(ctx.params.id)
      ctx.success(200, 'User has been deleted', user)
    } catch (err) {
      if (err instanceof Error) {
        ctx.error(400, err.message, err)
      } else {
        ctx.error(400, 'Error', err)
      }
    }
  }
}
