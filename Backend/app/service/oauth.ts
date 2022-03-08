import { Service } from 'egg'
import { User } from '../model/User'
import { OAuthUserData } from '../types'


export default class OauthService extends Service {

  public async getUser(data: OAuthUserData): Promise<object> {
    const res = await this.ctx.model.Oauth.findOne({
      where: {
        uid: data.id,
        provider: data.provider
      },
      include: [{ model: User }]
    })

    if (res) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return res.toJSON()
    } else {
      throw new Error('OAuth user does not exist')
    }
  }

}
