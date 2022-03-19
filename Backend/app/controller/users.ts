/* eslint '@typescript-eslint/no-unsafe-assignment': 'off' */
/* eslint '@typescript-eslint/no-unsafe-argument': 'off' */
/* eslint '@typescript-eslint/no-unsafe-member-access': 'off' */

/**
 * imports
 */
import path from 'node:path'
import * as fs from 'node:fs/promises'
import { Controller } from 'egg'
import AddUserRule from '../validator/addUserRule'
import EditUserRule from '../validator/editUserRule'


/**
 * controller
 */
export default class UsersController extends Controller {

  /**
   * Get all users from database (REST API - GET)
   * @return {Promise<void>}
   */
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


  /**
   * Add user to database (REST API - POST)
   * @return {Promise<void>}
   */
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


  /**
   * Delete user in database (REST API - DELETE)
   * @return {Promise<void>}
   */
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


  /**
   * Update user in database (REST API - PUT)
   * @return {Promise<void>}
   */
  public async updateUser(): Promise<void> {
    const { ctx } = this
    const data = ctx.request.body

    try {
      if (!('userState' in data)) {
        // validate
        ctx.validate(EditUserRule, data)
      }

      // save into database
      const user = await ctx.service.users.updateUser(ctx.params.id, data)

      ctx.success(200, 'User has been updated', user)
    } catch (err) {
      if (err instanceof Error) {
        ctx.error(400, err.message, err)
      } else {
        ctx.error(400, 'Error', err)
      }
    }
  }


  /**
   * Get user by ID (Primary key) (REST API - GET)
   * @return {Promise<void>}
   */
  public async getUserById(): Promise<void> {
    const { ctx } = this

    try {
      const user = await ctx.service.users.getUserById(ctx.params.id)
      ctx.success(200, 'success', user)
    } catch (err) {
      if (err instanceof Error) {
        ctx.error(500, err.message, err)
      } else {
        ctx.error(500, 'Error', err)
      }
    }
  }


  /**
   * Upload user's avatar file
   * @return {Promise<void>}
   */
  public async uploadAvatar(): Promise<void> {
    const { ctx } = this
    const avatar = ctx.request.files[0]

    const fileName = ctx.helper.encryptByMd5(`${ avatar.filename }${ Date.now() }`) + path.extname(avatar.filename)
    const filePath = path.join('/public/assets/images/avatars', fileName).replace(/\\/g, '/')
    const absoluteFilePath = path.join(this.config.baseDir, 'app', filePath)

    // copy file
    try {
      const avatarContent = await fs.readFile(avatar.filepath)
      await fs.writeFile(absoluteFilePath, avatarContent)
    } catch (err) {
      ctx.error(500, 'error', err)
    } finally {
      void ctx.cleanupRequestFiles() // clear temp file
    }

    ctx.success(200, 'Avatar has been uploaded', filePath)
  }
}
