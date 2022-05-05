const Controller = require('egg').Controller;

class videoController extends Controller {

  async createVideo() {
    const { ctx, service } = this
    const { body } = ctx.request

    ctx.validate({
      title: { type: "string" },
      description: { type: "string" },
      vodVideoId: { type: "string" },
      cover: { type: "string" },
    }, body)

    const video = {
      ...body,
      user: ctx.user._id
    }

    await service.video.createVideo(video)

    ctx.status = 201
    ctx.body = { video }
  }

  async getVideo() {
    const { videoId } = this.ctx.params
    const { ctx, service } = this
    const { mongoose } = this.app

    if (!mongoose.isValidObjectId(videoId)) {
      ctx.throw(402, 'id格式错误')
    }

    const video = await service.video.getVideo(videoId)

    ctx.body = { video }
  }

  async getVideos() {
    const { ctx, service } = this
    let { offset = 0, limit = 10 } = ctx.query

    const videos = await service.video.getVidoes(offset, limit)

    ctx.body = {
      videos,
      videosCount: videos.length
    }
  }

  async getChannelVideos() {
    const { ctx, service } = this
    const { offset = 0, limit = 10 } = ctx.query
    const { channelId } = ctx.params

    const videos = await service.video.getChannelVideos(channelId, offset, limit)

    ctx.body = {
      videos,
      videosCount: videos.length
    }
  }

  async getFeedVideos() {
    const { ctx, service } = this
    let { offset = 0, limit = 10 } = ctx.query

    const videos = await service.video.getFeedVideos(offset, limit)

    ctx.body = {
      videos,
      videosCount: videos.length
    }
  }

  async updateVideo() {
    const { ctx } = this
    const { body } = ctx.request
    const { videoId } = ctx.params
    const { Video } = this.app.model
    const { mongoose } = this.app

    if (!mongoose.isValidObjectId(videoId)) {
      ctx.throw(402, 'id格式错误')
    }

    ctx.validate({
      title: { type: 'string', required: false },
      description: { type: 'string', required: false },
      vodVideoId: { type: 'string', required: false },
      cover: { type: 'string', required: false },
    }, body)

    const video = await Video.findById(videoId)

    if (!video) {
      ctx.throw('404', 'Video Not Found.')
    }

    if (ctx.user.id !== video.user.toString()) {
      ctx.throw('403')
    }

    Object.assign(video, body)

    await video.save()

    ctx.body = { video }
  }

  async deleteVideo() {
    const { ctx } = this
    const { videoId } = ctx.params
    const { Video } = this.app.model
    const { mongoose } = this.app

    if (!mongoose.isValidObjectId(videoId)) {
      ctx.throw(402, 'id格式错误')
    }
    const video = await Video.findById(videoId)
    if (!video) {
      ctx.throw(404)
    }

    if (ctx.user.id !== video.user.toString()) {
      ctx.throw(403)
    }

    await video.remove()

    ctx.status = 204
  }

  async likeVideo() {
    const { ctx } = this
    const video = await this.service.video.likeVideo()

    ctx.body = { video }
  }

  async dislikeVideo() {
    const { ctx } = this
    const video = await this.service.video.dislikeVideo()
    ctx.body = { video }
  }

  async getLikedVideos() {
    const { ctx, service } = this
    const { offset = 0, limit = 10 } = ctx.query

    const videos = await service.video.getLikedVideos(offset, limit)

    ctx.body = {
      videos,
      videosCount: videos.length
    }
  }

  async addComment() {
    const { ctx, service } = this
    const { body } = ctx.request
    const { videoId } = ctx.params
    const { mongoose } = this.app

    if (!mongoose.isValidObjectId(videoId)) {
      this.ctx.throw(402, 'id格式错误')
    }

    const video = await this.app.model.Video.findById(videoId)
    if (!video) {
      this.ctx.throw(404, "视频不存在")
    }

    const comment = await service.video.addComment(body.content, videoId, video)

    ctx.body = { comment }
  }

  async deleteComment() {
    const { ctx } = this
    const { commentId } = this.ctx.params
    const { Comment } = this.app.model
    const { mongoose } = this.app
    const user = ctx.user.id

    if (!mongoose.isValidObjectId(commentId)) {
      ctx.throw(402, 'commentId格式错误')
    }

    const comment = await Comment.findById(commentId)
    if (!comment) {
      ctx.throw(404)
    }

    if (user !== comment.user.toString()) {
      ctx.throw(403)
    }

    await comment.remove()

    ctx.status = 204
  }

  async getComments() {
    const { ctx, service } = this
    const { videoId } = ctx.params
    const { offset = 0, limit = 10 } = ctx.query

    const comments = await service.video.getComments(videoId, offset, limit)

    ctx.body = {
      comments,
      commentsCount: comments.length
    }
  }
}

module.exports = videoController;
