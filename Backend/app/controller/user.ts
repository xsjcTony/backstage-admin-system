/* eslint '@typescript-eslint/no-unsafe-assignment': 'off' */
/* eslint '@typescript-eslint/no-unsafe-argument': 'off' */

/**
 * imports
 */
import { Controller } from 'egg'
import { RegisterType, RegisterData, LoginData } from '../types'
import EmailUserRule from '../validator/emailUserRule'
import NormalUserRule from '../validator/normalUserRule'


/**
 * controller
 */
export default class UserController extends Controller {

  /**
   * Register user and create corresponding row in database.
   * @return {Promise<void>} - Result.
   */
  public async create(): Promise<void> {
    const { ctx } = this

    try {
      // validate
      this._validateUserInfo()

      // save into database
      const data = await ctx.service.user.createUser(ctx.request.body)

      ctx.success(200, 'Registered', data)
    } catch (err) {
      if (err instanceof Error) {
        ctx.error(400, err.message, err)
      } else {
        ctx.error(400, 'error', err)
      }
    }
  }


  public async login(): Promise<void> {
    const { ctx } = this
    const data: LoginData = ctx.request.body

    try {
      ctx.helper.verifyCaptcha(data.captcha)
      const res = await ctx.service.user.loginUser(data)

      ctx.success(200, 'Logged in', res)
    } catch (err) {
      if (err instanceof Error) {
        ctx.error(400, err.message, err)
      } else {
        ctx.error(400, 'error', err)
      }
    }
  }


  /**
   * Helper functions
   */


  /**
   * Validate helper.
   * @private
   */
  private _validateUserInfo(): void {
    const { ctx } = this
    const data: RegisterData = ctx.request.body
    const registerType: RegisterType = data.registerType

    switch (registerType) {
      case RegisterType.Normal:
        ctx.validate(NormalUserRule, data)
        ctx.helper.verifyCaptcha(data.captcha)
        break
      case RegisterType.Email:
        ctx.validate(EmailUserRule, data)
        ctx.helper.verifyEmail(data.captcha)
        break
      default:
        throw new Error(`Register type '${ data.registerType }' is invalid`)
    }
  }
}
