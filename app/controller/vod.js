const Controller = require('egg').Controller;

class vodController extends Controller {

  async createUploadVideo() {
      const query = this.ctx.query
      this.ctx.validate({
          Title:{ type: 'string' },
          FileName:{ type: 'string' }
      }, query)

      const vodClient = this.app.vodClient
      return this.ctx.body = await vodClient.request('CreateUploadVideo', query, {})
  }

  async refreshUpload(){
      const query = this.ctx.query
      this.ctx.validate({
          VideoId: {type: 'string'}
      }, query)

      const vodClient = this.app.vodClient

      return this.ctx.body = await vodClient.request('RefreshUploadVideo', query, {})
  }
}

module.exports = vodController;
