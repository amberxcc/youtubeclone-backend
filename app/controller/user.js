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
    const newUser = await this.service.user.createNewUser(body.user)

    return this.ctx.body = {
      user: {
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        channelDescription: newUser.channelDescription,
        token: ctx.helper.jwtSign({ id: newUser.id })
      }
    }

  }

  async login(){
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

    if (ctx.helper.myHash(body.user.password) !== user.password){
      ctx.throw(422, "密码错误")
    }

    return this.ctx.body = {
      user: {
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        channelDescription: user.channelDescription,
        token: ctx.helper.jwtSign({ id: user.id })
      }
    }
  }

  async getCurrentUser(){
    const { ctx } = this

    return this.ctx.body = {
      user: {
        username: ctx.user.username,
        email: ctx.user.email,
        avatar: ctx.user.avatar,
        channelDescription: ctx.user.channelDescription,
        token: ctx.helper.jwtSign({ id: ctx.user.id })
      }
    }
  }

  async update(){
    const { ctx } = this
    const { body } = ctx.request

    ctx.validate({
      username: { type: "string", required: false },
      email: { type: "email", required: false },
      password: { type: "string", required: false },
      avatar: { type: "string", required: false },
      channelDescription: { type: "string", required: false },
    }, body.user)

    const service = this.service.user

    if(body.user.username){
      if(body.user.username !== ctx.user.username && await service.findUserByUsername(body.user.username)){
          ctx.throw(422, "用户名已存在")
      }
    }

    if(body.user.email){
      if(body.user.email !== ctx.user.email && await service.findUserByEmail(body.user.email)){
          ctx.throw(422, "邮箱已存在")
      }
    }

    const target = await service.updateUser(body.user)

    const user = {
      username: target.username,
      email: target.email,
      avatar: target.avatar,
      channelDescription: target.channelDescription
    }

    return ctx.body = { user }
  }

  async subscribe(){
    const {ctx} = this
    const userId = this.ctx.user.id
    const channelId = this.ctx.params.userId
    

    if(userId === channelId) {
      throw(422, "不能订阅自己")
    }

    const channelInfo = await this.service.user.subscribe(userId, channelId)


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

    return ctx.body = { user }
    
  }

  async unSubscribe(){
    const {ctx} = this
    const userId = this.ctx.user.id
    const channelId = this.ctx.params.userId
    

    if(userId === channelId) {
      throw(422, "不能订阅自己")
    }

    const channelInfo = await this.service.user.unSubscribe(userId, channelId)

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

    return ctx.body = { user }
    
  }

  async getProfile(){
    const {ctx} = this
    const channelId = this.ctx.params.channelId
    let isSubscribed = false

    const channelInfo = await this.service.user.getChannelInfo(channelId)

    if(ctx.user){
      isSubscribed = await this.service.user.isSubscribed(ctx.user.id, channelId)
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

    return ctx.body = { user }
    
  }
  
  async getSubscriptions(){
    const {ctx} = this
    const subscriptions = await this.service.user.getSubscriptions(ctx.params.userId)
    return ctx.body = {subscriptions}
  }
}

module.exports = UserController;
