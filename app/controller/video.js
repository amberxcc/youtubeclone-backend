const Controller = require('egg').Controller;

class videoController extends Controller {

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

  async getVideo() {
    const { Video, Like, Subscription } = this.app.model
    const { videoId } = this.ctx.params
    const { ctx } = this
    const { mongoose } = this.app

    if (!mongoose.isValidObjectId(videoId)) {
      this.ctx.throw(402, 'id格式错误')
    }

    let video = await Video.findById(videoId).populate('user', 'id username avatar subscriberCount')
    if (!video) ctx.throw(404, 'Video Not Found')

    video = video.toJSON()
    video.isLiked = false
    video.isDisLiked = false
    video.isSubscribed = false

    if (ctx.user) {
      const userId = ctx.user._id

      const checkLike = Like.findOne({ user: userId, video: videoId, like: 1 })
      const checkDislike = Like.findOne({ user: userId, video: videoId, like: -1 })
      const checkSubscription = Subscription.findOne({ user: userId, channel: video.user._id })
      const [likeResult, dislikeResult, subscriptionResult] = await Promise.all([checkLike, checkDislike, checkSubscription])

      video.isLiked = likeResult ? true : false
      video.isDisLiked = dislikeResult ? true : false
      video.isSubscribed = subscriptionResult ? true : false
    }
    return ctx.body = { video }
  }

  async getVideos() {
    const { Video } = this.app.model
    let { offset = 0, limit = 10 } = this.ctx.query

    const getVideos = Video
      .find()
      .populate('user')
      .sort({ 'createAt': -1 })
      .skip(Number(offset))
      .limit(Number(limit))

    const getVideoCount = Video.countDocuments()

    const [videos, videosCount] = await Promise.all([getVideos, getVideoCount])

    return this.ctx.body = { videos, videosCount }
  }

  async getChannelVideos() {
    const { Video } = this.app.model
    let { offset = 0, limit = 10 } = this.ctx.query
    const { channelId } = this.ctx.params

    const getVideos = Video
      .find({ user: channelId })
      .populate('user')
      .sort({ 'createAt': -1 })
      .skip(Number(offset))
      .limit(Number(limit))

    const getVideoCount = Video.countDocuments({ user: channelId })

    const [videos, videosCount] = await Promise.all([getVideos, getVideoCount])

    return this.ctx.body = { videos, videosCount }
  }

  async getFeedVideos() {
    const { Video, Subscription } = this.app.model
    let { offset = 0, limit = 10 } = this.ctx.query
    const user = this.ctx.user.id

    const channels = await Subscription.find({ user }).populate('channel')
    const getVideos = Video
      .find({ 'user': { '$in': channels.map(item => item.channel.id) } })
      .populate('user')
      .sort({ 'createAt': -1 })
      .skip(Number(offset))
      .limit(Number(limit))

    const getVideoCount = Video.countDocuments({ 'user': { '$in': channels.map(item => item.channel.id) } })

    const [videos, videosCount] = await Promise.all([getVideos, getVideoCount])

    return this.ctx.body = { videos, videosCount }
  }

  async updateVideo() {
    const { body } = this.ctx.request
    const { videoId } = this.ctx.params
    const { Video } = this.app.model
    const { mongoose } = this.app

    if (!mongoose.isValidObjectId(videoId)) {
      this.ctx.throw(402, 'id格式错误')
    }

    this.ctx.validate({
      title: { type: 'string', required: false },
      description: { type: 'string', required: false },
      vodVideoId: { type: 'string', required: false },
      cover: { type: 'string', required: false },
    }, body)

    const video = await Video.findById(videoId)

    if (!video) {
      this.ctx.throw('404', 'Video Not Found.')
    }

    if (this.ctx.user.id !== video.user.toString()) {
      this.ctx.throw('403')
    }

    Object.assign(video, body)

    await video.save()

    return this.ctx.body = { video }
  }

  async deleteVideo() {
    const { videoId } = this.ctx.params
    const { Video } = this.app.model
    const { mongoose } = this.app

    if (!mongoose.isValidObjectId(videoId)) {
      this.ctx.throw(402, 'id格式错误')
    }
    const video = await Video.findById(videoId)
    if (!video) {
      this.ctx.throw(404)
    }

    if (this.ctx.user.id !== video.user.toString()) {
      this.ctx.throw(403)
    }

    await video.remove()

    return this.ctx.status = 204
  }

  async likeVideo() {
    const video = await this.service.video.likeVideo()
    return this.ctx.body = { video }
  }

  async dislikeVideo() {
    const video = await this.service.video.dislikeVideo()
    return this.ctx.body = { video }
  }

  async getLikedVideos() {
    const { Video, Like } = this.app.model
    let { offset = 0, limit = 10 } = this.ctx.query
    const user = this.ctx.user.id

    const likes = await Like.find({ user, like: 1 })
    const getVideos = Video
      .find({ '_id': { '$in': likes.map(item => item.video) } })
      .populate('user')
      .sort({ 'createAt': -1 })
      .skip(Number(offset))
      .limit(Number(limit))

    const getVideoCount = Video.countDocuments({ '_id': { '$in': likes.map(item => item.video) } })

    const [videos, videosCount] = await Promise.all([getVideos, getVideoCount])

    return this.ctx.body = { videos, videosCount }
  }

  async addComment() {
    const comment = await this.service.video.addComment()
    return this.ctx.body = { comment }
  }

  async deleteComment() {
    const { commentId } = this.ctx.params
    const { Comment } = this.app.model
    const { mongoose } = this.app
    const user = this.ctx.user.id
    
    if (!mongoose.isValidObjectId(commentId)) {
      this.ctx.throw(402, 'commentId格式错误')
    }

    const comment = await Comment.findById(commentId)
    if (!comment) {
      this.ctx.throw(404)
    }

    if (user !== comment.user.toString()) {
      this.ctx.throw(403)
    }

    await comment.remove()

    return this.ctx.status = 204
  }

  async getComments() {
    const { videoId } = this.ctx.params
    const { offset = 0, limit = 10 } = this.ctx.query
    const { Comment } = this.app.model

    const getComments = Comment
      .find({ video: videoId })
      .populate('user')
      .sort({ 'createAt': -1 })
      .skip(Number(offset))
      .limit(Number(limit))

    const getCommentsCount = Comment.countDocuments({ video: videoId })

    const [comments, commentsCount] = await Promise.all([getComments, getCommentsCount])

    return this.ctx.body = {
      comments,
      commentsCount
    }
  }
}

module.exports = videoController;
