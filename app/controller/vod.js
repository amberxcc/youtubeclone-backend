const Controller = require('egg').Controller;

class vodController extends Controller {

    async createUploadVideo() {
        const { ctx } = this
        const query = ctx.query
        ctx.validate({
            Title: { type: 'string' },
            FileName: { type: 'string' }
        }, query)

        const vodClient = this.app.vodClient
        ctx.body = await vodClient.request('CreateUploadVideo', query, {})
    }

    async refreshUpload() {
        const { ctx } = this
        const query = ctx.query

        ctx.validate({
            VideoId: { type: 'string' }
        }, query)

        const vodClient = this.app.vodClient

        ctx.body = await vodClient.request('RefreshUploadVideo', query, {})
    }
}

module.exports = vodController;
