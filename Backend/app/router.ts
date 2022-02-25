/* eslint '@typescript-eslint/unbound-method': 'off' */

import { Application } from 'egg'

export default (app: Application): void => {
  const { controller, router } = app

  router.get('/', controller.home.index)
  router.get('/captcha', controller.util.generateCaptcha)
  router.get('/verify_email', controller.util.sendVerificationEmail)

  router.post('/register', controller.user.create)
}
