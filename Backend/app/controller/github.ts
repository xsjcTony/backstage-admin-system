/* eslint 'camelcase': 'off' */
/* eslint '@typescript-eslint/no-unsafe-assignment': 'off' */
/* eslint '@typescript-eslint/no-unsafe-argument': 'off' */
/* eslint '@typescript-eslint/no-unsafe-member-access': 'off' */

import { URLSearchParams } from 'node:url'
import { Controller } from 'egg'
import * as jwt from 'jsonwebtoken'
import type { OAuthUserData } from '../types'


export default class GithubController extends Controller {

  /**
   * Get third-party login page
   * @return {Promise<void>}
   */
  public async getLoginView(): Promise<void> {
    const baseURL = 'https://github.com/login/oauth/authorize'
    const options = {
      client_id: 'f3ca6a1f5ca9ed50e6ca',
      scope: 'user'
    }

    const url = `${ baseURL }?${ new URLSearchParams(options).toString() }`
    this.ctx.redirect(url)
  }


  public async getAccessToken(): Promise<void> {
    const { ctx } = this
    const code = ctx.query.code

    const baseURL = 'https://github.com/login/oauth/access_token'
    const options = {
      client_id: 'f3ca6a1f5ca9ed50e6ca',
      client_secret: '33e0aa6ac3f01448edca777c40a10ceabeff80a6',
      code
    }

    const res = await ctx.curl(baseURL, {
      method: 'POST',
      data: options,
      dataType: 'json',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    await this._getGithubUserInfo(res.data['access_token'] as string)
  }


  private async _getGithubUserInfo(accessToken: string): Promise<void> {
    const baseURL = 'https://api.github.com/user'
    const res = await this.ctx.curl(baseURL, {
      method: 'GET',
      dataType: 'json',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${ accessToken }`
      }
    })

    await this._goToAdmin({ ...res.data, provider: 'github' })
  }


  private async _goToAdmin(data: OAuthUserData): Promise<void> {
    const { ctx } = this

    try {
      const user = await ctx.service.oauth.getUser(data)
      const token = jwt.sign(user, this.config.keys, { expiresIn: '7d' })

      ctx.cookies.set('token', token, {
        path: '/',
        maxAge: 24 * 60 * 60 * 1000, // 1 day,
        httpOnly: false,
        signed: false
      })

      ctx.redirect('http://127.0.0.1:3000/admin')
    } catch (err) {
      console.error(err)
    }
  }
}
