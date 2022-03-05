/* eslint '@typescript-eslint/unbound-method': 'off' */

import { Application } from 'egg'

export default (app: Application): void => {
  const { controller, router } = app

  /**
   * Utils
   */
  router.get('/', controller.home.index)
  router.get('/captcha', controller.util.generateCaptcha)
  router.get('/verify_email', controller.util.sendVerificationEmail)


  /**
   * User
   */
  router.post('/register', controller.user.create)
  router.post('/login', controller.user.login)
  router.get('/is_logged_in', controller.user.isLoggedIn)
}
