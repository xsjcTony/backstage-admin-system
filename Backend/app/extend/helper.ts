import { IHelper } from 'egg'
import { generateCaptcha, verifyCaptcha } from '../util/captcha'
import { sendVerificationEmail, verifyEmail } from '../util/verificationEmail'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { createHash } from 'node:crypto'

export default {
  generateCaptcha(this: IHelper): string {
    return generateCaptcha(this.ctx)
  },

  verifyCaptcha(this: IHelper, clientCaptcha: string): void {
    verifyCaptcha(this.ctx, clientCaptcha)
  },

  async sendVerificationEmail(this: IHelper, to: string): Promise<SMTPTransport.SentMessageInfo> {
    return sendVerificationEmail(this.ctx, to)
  },

  verifyEmail(this: IHelper, clientCode: string): void {
    verifyEmail(this.ctx, clientCode)
  },

  _md5(password: string): string {
    return createHash('md5')
      .update(password)
      .digest('hex')
  },

  encryptByMd5(this: IHelper, password: string): string {
    // 加盐处理
    return this._md5(`${ password }${ this.app.config.keys }`)
  }
}
