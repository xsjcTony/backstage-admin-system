import type { Context } from 'egg'

export default {
  success(this: Context, code = 200, msg: unknown = 'success', data: unknown = {}): void {
    this.body = {
      code,
      msg,
      data
    }
  },

  error(this: Context, code = 500, msg: unknown = 'error', data: unknown = {}): void {
    this.body = {
      code,
      msg,
      data
    }
  }
}
