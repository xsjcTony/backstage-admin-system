/* eslint '@typescript-eslint/unbound-method': 'off' */
/* eslint '@typescript-eslint/no-unsafe-assignment': 'off' */
/* eslint '@typescript-eslint/no-unsafe-argument': 'off' */

import { Application } from 'egg'


export default async (app: Application): Promise<void> => {
  const { controller, router } = app
  const authenticator = app.middleware.authenticator(null, app)


  router.get('/', controller.home.index);


  /**
   * Captcha
   */
  (await import('./router/captcha')).default(app);


  /**
   * Account
   */
  (await import('./router/account')).default(app)


  /**
   * Users - REST API
   */
  router.get('/api/v1/users', authenticator, controller.users.getAllUsers)
  router.post('/api/v1/users', authenticator, controller.users.createUser)
  router.delete('/api/v1/users/:id', authenticator, controller.users.deleteUser)
  router.put('/api/v1/users/:id', authenticator, controller.users.updateUser)
  router.get('/api/v1/users/:id', authenticator, controller.users.getUserById)
  router.post('/api/v1/users/avatar', authenticator, controller.users.uploadAvatar)
  router.post('/api/v1/users/import', authenticator, controller.users.importUsers)
}
