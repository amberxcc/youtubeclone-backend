const Controller = require('egg').Controller;

class UserController extends Controller {

  async register() {
    const { ctx } = this
    ctx.validate({
        username: {type: "string"},
        email: ""
    })
    return this.ctx.body = "register"
  }


  async login() {
    return this.ctx.body = "login"
  }

}

module.exports = UserController;
