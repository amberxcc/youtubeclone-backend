const Service = require('egg').Service;

class VideoService extends Service {

    get Like(){
        return this.app.model.Like
    }
    get Video(){
        return this.app.model.Video
    }

    async likeVideo(){
        const { videoId } = this.ctx.params
        const { mongoose } = this.app
        const user = this.ctx.user.id
    
        if(!mongoose.isValidObjectId(videoId)){
          this.ctx.throw(402, 'id格式错误')
        }
    
        const video = await this.Video.findById(videoId)
        if(!video){
          this.ctx.throw(404, "视频不存在")
        }

        let isLike = true

        const likeInfo = await this.Like.findOne({user, video: videoId})

        if(likeInfo && likeInfo.like === 1){
            await likeInfo.remove()
            video.likeCount--
            await video.save()
            isLike = false
        }else if(likeInfo && likeInfo.like === -1){
            likeInfo.like = 1
            video.likeCount++
            video.dislikeCount--
            await video.save()
            await likeInfo.save()
        }else{
            await new this.Like({like: 1, user, video: videoId }).save()
            video.likeCount++
            await video.save()
        }

        return {
            ...video.toJSON(),
            isLike
        }
    }

    async dislikeVideo(){
        const { videoId } = this.ctx.params
        const { mongoose } = this.app
        const user = this.ctx.user.id
    
        if(!mongoose.isValidObjectId(videoId)){
          this.ctx.throw(402, 'id格式错误')
        }
    
        const video = await this.Video.findById(videoId)
        if(!video){
          this.ctx.throw(404, "视频不存在")
        }

        let isdisLike = true

        const likeInfo = await this.Like.findOne({user, video: videoId})

        if(likeInfo && likeInfo.like === -1){
            await likeInfo.remove()
            video.dislikeCount--
            isdisLike = false
            await video.save()
        }else if(likeInfo && likeInfo.like === 1){
            likeInfo.like = 1
            video.likeCount--
            video.dislikeCount++
            await video.save()
            await likeInfo.save()
        }else{
            await new this.Like({like: -1, user, video: videoId }).save()
            video.dislikeCount++
            await video.save()
        }

        return {
            ...video.toJSON(),
            isLike
        }
    }

    async addComment(){
        const { videoId } = this.ctx.params
        const { body } = this.ctx.request
        const { Comment } = this.app.model
        const { mongoose } = this.app
        const user = this.ctx.user.id
    
        if(!mongoose.isValidObjectId(videoId)){
          this.ctx.throw(402, 'id格式错误')
        }
    
        const video = await this.Video.findById(videoId)
        if(!video){
          this.ctx.throw(404, "视频不存在")
        }
    
        const comment = new Comment({
          content: body.content,
          user,
          video: videoId,
        })
        video.commentCount++
    
        await video.save()
        await comment.save()

        return comment
    }


}

module.exports = VideoService
