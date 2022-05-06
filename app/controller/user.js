const Controller = require('egg').Controller;

class UserController extends Controller {

  async register() {
    const { ctx } = this
    const { body } = ctx.request

    ctx.validate({
      username: { type: "string" },
      email: { type: "email" },
      password: { type: "string" }
    }, body.user)

    if (await this.service.user.findUserByEmail(body.user.email)) {
      ctx.throw(422, "邮箱已存在")
    }
    if (await this.service.user.findUserByUsername(body.user.username)) {
      ctx.throw(422, "用户名已存在")
    }
    const newUser = await this.service.user.createNewUser(body.user)

    ctx.body = {
      user: {
        ...ctx.helper._.pick(newUser, [
          'username',
          'email',
          'avatar',
          'channelDescription'
        ]),
        token: ctx.helper.jwtSign({ id: newUser.id })
      }
    }

  }

  async login() {
    const { ctx } = this
    const { body } = ctx.request

    ctx.validate({
      email: { type: "email" },
      password: { type: "string" }
    }, body.user)

    const user = await this.service.user.findUserByEmail(body.user.email)

    if (!user) {
      ctx.throw(422, "邮箱不存在")
    }

    if (ctx.helper.myHash(body.user.password) !== user.password) {
      ctx.throw(422, "密码错误")
    }

    ctx.body = {
      user: {
        ...ctx.helper._.pick(user, [
          'username',
          'email',
          'avatar',
          'channelDescription'
        ]),
        token: ctx.helper.jwtSign({ id: user.id })
      }
    }
  }

  async getCurrentUser() {
    const { ctx } = this

    ctx.body = {
      user: {
        ...ctx.helper._.pick(ctx.user, [
          'username',
          'email',
          'avatar',
          'channelDescription'
        ]),
        token: ctx.helper.jwtSign({ id: ctx.user.id })
      }
    }
  }

  async update() {
    const { ctx, service } = this
    const { body } = ctx.request

    ctx.validate({
      username: { type: "string", required: false },
      email: { type: "email", required: false },
      password: { type: "string", required: false },
      avatar: { type: "string", required: false },
      channelDescription: { type: "string", required: false },
    }, body.user)


    if (body.user.username) {
      if (body.user.username !== ctx.user.username && await service.user.findUserByUsername(body.user.username)) {
        ctx.throw(422, "用户名已存在")
      }
    }

    if (body.user.email) {
      if (body.user.email !== ctx.user.email && await service.user.findUserByEmail(body.user.email)) {
        ctx.throw(422, "邮箱已存在")
      }
    }

    const target = await service.user.updateUser(body.user)

    const user = {
      ...ctx.helper._.pick(target, [
        'username',
        'email',
        'avatar',
        'channelDescription'
      ])
    }

    ctx.body = { user }
  }

  async subscribe() {
    const { ctx, service } = this
    const userId = this.ctx.user.id
    const channelId = this.ctx.params.userId


    if (userId === channelId) {
      throw (422, "不能订阅自己")
    }

    const channelInfo = await service.user.subscribe(userId, channelId)


    const user = {
      ...ctx.helper._.pick(channelInfo, [
        "id",
        "username",
        "email",
        "avatar",
        "channelDescription",
        "cover",
        "subscriberCount"
      ]),
      isSubscribed: true,
    }

    ctx.body = { user }

  }

  async unSubscribe() {
    const { ctx, service } = this
    const userId = this.ctx.user.id
    const channelId = this.ctx.params.userId


    if (userId === channelId) {
      throw (422, "不能订阅自己")
    }

    const channelInfo = await service.user.unSubscribe(userId, channelId)

    const user = {
      ...ctx.helper._.pick(channelInfo, [
        "id",
        "username",
        "email",
        "avatar",
        "channelDescription",
        "cover",
        "subscriberCount"
      ]),
      isSubscribed: false,
    }

    ctx.body = { user }

  }

  async getProfile() {
    const { ctx, service } = this
    const channelId = this.ctx.params.channelId
    let isSubscribed = false

    const channelInfo = await service.user.getChannelInfo(channelId)

    if (ctx.user) {
      isSubscribed = await service.user.isSubscribed(ctx.user.id, channelId)
    }

    const user = {
      ...ctx.helper._.pick(channelInfo, [
        "id",
        "username",
        "email",
        "avatar",
        "channelDescription",
        "cover",
        "subscriberCount"
      ]),
      isSubscribed,
    }

    ctx.body = { user }

  }

  async getSubscriptions() {
    const { ctx, service } = this
    const subscriptions = await service.user.getSubscriptions(ctx.params.userId)
    ctx.body = { subscriptions }
  }
}

module.exports = UserController;
