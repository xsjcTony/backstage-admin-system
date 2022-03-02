/* eslint '@typescript-eslint/no-unsafe-assignment': 'off' */
/* eslint '@typescript-eslint/no-unsafe-argument': 'off' */

/**
 * imports
 */
import { Controller } from 'egg'
import NormalUserRule from '../validator/normalUserRule'
import EmailUserRule from '../validator/emailUserRule'
import { RegisterType, RegisterData } from '../util/types'


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

      ctx.success(200, '注册成功', data)
    } catch (err) {
      if (err instanceof Error) {
        ctx.error(400, err.message, err)
      } else {
        ctx.error(400, 'error', err)
      }
    }
  }

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
