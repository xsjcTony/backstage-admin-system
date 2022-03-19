import { Service } from 'egg'
import { Oauth } from '../model/Oauth'
import { User } from '../model/User'
import type { OAuthUserData } from '../types'


export default class OauthService extends Service {

  public async getOAuth(data: OAuthUserData): Promise<Oauth> {
    const res = await this.ctx.model.Oauth.findOne({
      where: {
        uid: data.id,
        provider: data.provider
      },
      include: [{
        model: User,
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt']
        }
      }]
    })

    if (res) {
      return res.toJSON() as Oauth
    } else {
      throw new Error('OAuth user does not exist')
    }
  }


  public async createOAuth(accessToken: string, provider: string, uid: number, userId: number): Promise<Oauth> {
    return this.ctx.model.Oauth.create({
      accessToken,
      provider,
      uid,
      userId
    })
  }

  public async deleteOAuth(id: number): Promise<void> {
    await Oauth.destroy({ where: { id } })
  }
}
