const Controller = require('egg').Controller;

class vodController extends Controller {

  async createVideo() {
    const { body } = this.ctx.request
    this.ctx.validate({
        title: { type: "string" },
        description: { type: "string" },
        vodVideoId: { type: "string" },
        cover: { type: "string" },
    }, body)

    const video = {
        ...body,
        user: this.ctx.user._id
    }

    await new this.app.model.Video(video).save()

    this.ctx.status = 201
    this.ctx.body = { video }
  }

  async getVideo(){
      const { Video, VideoLike, Subscription } = this.app.model
      const { videoId } = this.ctx.params
      const { ctx } = this

      let video = await Video.findById(videoId).populate('user', 'id username avatar subscriberCount')
      if(!video) ctx.throw(404, 'Video Not Found')

      video = video.toJSON()
      video.isLiked = false
      video.isDisLiked = false
      video.isSubscribed = false

      if(ctx.user){
          const userId = ctx.user._id
          if(await VideoLike.findOne({user:userId, video:videoId, like:1})){
            video.isLiked = true
          }
          if(await VideoLike.findOne({user:userId, video:videoId, like:-1})){
            video.isDisLiked = true
          }
          if(await Subscription.findOne({user:userId, channel:video.user._id})){
            video.isSubscribed = true
          }
      }

      return ctx.body = {video}

  }
}

module.exports = vodController;
