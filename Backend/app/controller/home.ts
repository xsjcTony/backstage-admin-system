import { Controller } from 'egg'

export default class HomeController extends Controller {
  public async index(): Promise<void> {
    const { ctx } = this
    ctx.body = await ctx.model.User.findAll()
  }
}
