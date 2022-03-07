import { URLSearchParams } from 'node:url'
import { Controller } from 'egg'


export default class GithubController extends Controller {
  public async loginView(): Promise<void> {
    // get third-party login page
    const baseURL = 'https://github.com/login/oauth/authorize'
    const options = {
      // eslint-disable-next-line camelcase
      client_id: 'f3ca6a1f5ca9ed50e6ca',
      scope: 'user'
    }

    const url = `${ baseURL }?${ new URLSearchParams(options).toString() }`
    this.ctx.redirect(url)
  }
}
