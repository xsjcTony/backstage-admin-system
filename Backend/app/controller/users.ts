// /* eslint '@typescript-eslint/no-unsafe-assignment': 'off' */
// /* eslint '@typescript-eslint/no-unsafe-argument': 'off' */

/**
 * imports
 */
import { Controller } from 'egg'


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
        ctx.error(500, err.message)
      }
    }
  }
}
