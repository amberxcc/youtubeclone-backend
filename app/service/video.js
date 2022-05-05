const Service = require('egg').Service;

class VideoService extends Service {

  get Like() {
    return this.app.model.Like
  }
  get Video() {
    return this.app.model.Video
  }
  get Subscription() {
    return this.app.model.Subscription
  }
  get Comment() {
    return this.app.model.Comment
  }

  async createVideo(video) {
    await new this.Video(video).save()
  }

  async getVideo(videoId) {
    const { ctx } = this
    let video = await this.Video.findById(videoId).populate('user', 'id username avatar subscriberCount')
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

    return video
  }

  async getVidoes(offset, limit) {

    const videos = await this.Video
      .find()
      .populate('user')
      .sort({ 'createAt': -1 })
      .skip(Number(offset))
      .limit(Number(limit))

    return videos
  }

  async getChannelVideos(channelId, offset, limit) {
    const videos = await this.Video
      .find({ user: channelId })
      .populate('user')
      .sort({ 'createAt': -1 })
      .skip(Number(offset))
      .limit(Number(limit))

    return videos
  }

  async getFeedVideos(offset, limit) {
    const user = this.ctx.user.id

    const channels = await this.Subscription.find({ user }).populate('channel')
    const videos = await this.Video
      .find({ 'user': { '$in': channels.map(item => item.channel.id) } })
      .populate('user')
      .sort({ 'createAt': -1 })
      .skip(Number(offset))
      .limit(Number(limit))

    return videos
  }

  async getLikedVideos(offset, limit) {
    const user = ctx.user.id
    const likes = await this.Like.find({ user, like: 1 })
    const videos = await this.Video
      .find({ '_id': { '$in': likes.map(item => item.video) } })
      .populate('user')
      .sort({ 'createAt': -1 })
      .skip(Number(offset))
      .limit(Number(limit))

    return videos
  }

  async likeVideo() {
    const { videoId } = this.ctx.params
    const { mongoose } = this.app
    const user = this.ctx.user.id

    if (!mongoose.isValidObjectId(videoId)) {
      this.ctx.throw(402, 'id格式错误')
    }

    const video = await this.Video.findById(videoId)
    if (!video) {
      this.ctx.throw(404, "视频不存在")
    }

    let isLike = true

    const likeInfo = await this.Like.findOne({ user, video: videoId })

    if (likeInfo && likeInfo.like === 1) {
      await likeInfo.remove()
      video.likeCount--
      await video.save()
      isLike = false
    } else if (likeInfo && likeInfo.like === -1) {
      likeInfo.like = 1
      video.likeCount++
      video.dislikeCount--
      await video.save()
      await likeInfo.save()
    } else {
      await new this.Like({ like: 1, user, video: videoId }).save()
      video.likeCount++
      await video.save()
    }

    return {
      ...video.toJSON(),
      isLike
    }
  }

  async dislikeVideo() {
    const { videoId } = this.ctx.params
    const { mongoose } = this.app
    const user = this.ctx.user.id

    if (!mongoose.isValidObjectId(videoId)) {
      this.ctx.throw(402, 'id格式错误')
    }

    const video = await this.Video.findById(videoId)
    if (!video) {
      this.ctx.throw(404, "视频不存在")
    }

    let isdisLike = true

    const likeInfo = await this.Like.findOne({ user, video: videoId })

    if (likeInfo && likeInfo.like === -1) {
      await likeInfo.remove()
      video.dislikeCount--
      isdisLike = false
      await video.save()
    } else if (likeInfo && likeInfo.like === 1) {
      likeInfo.like = 1
      video.likeCount--
      video.dislikeCount++
      await video.save()
      await likeInfo.save()
    } else {
      await new this.Like({ like: -1, user, video: videoId }).save()
      video.dislikeCount++
      await video.save()
    }

    return {
      ...video.toJSON(),
      isLike
    }
  }

  async addComment(content, videoId, video) {
    const user = this.ctx.user.id
    const comment = new this.Comment({
      content,
      user,
      video: videoId
    })

    video.commentCount++
    await Promise.all([video.save(), comment.save()]) 
    return comment
  }

  async getComments(videoId, offset, limit) {
    const comments = await this.Comment
      .find({ video: videoId })
      .populate('user')
      .sort({ 'createAt': -1 })
      .skip(Number(offset))
      .limit(Number(limit))

    return comments
  }

}

module.exports = VideoService
