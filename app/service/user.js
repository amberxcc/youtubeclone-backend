const Service = require('egg').Service;

class UserService extends Service {

    get User(){
        return this.app.model.User
    }
    get Subscription(){
        return this.app.model.Subscription
    }

    async findUserByEmail(email) {
        return await this.User.findOne({email})
    }

    async findUserByUsername(username) {
        return await this.User.findOne({username})
    }

    async createNewUser(data){
        const user = new this.User(data)
        await user.save()
        return user
    }

    async updateUser(data){
        return await this.User.findOneAndUpdate({_id:this.ctx.user._id}, data, {new: true,useFindAndModify: false})
    }

    async subscribe(userId, channelId){
        const channel = await this.User.findById(channelId)

        if(!channel) this.ctx.throw(422, "channel 不存在")

        if(await this.Subscription.findOne({user:userId, channel:channelId})){
            return channel
        }

        channel.subscriberCount++
        this.ctx.user.subscribedCount++

        await new this.Subscription({user:userId, channel:channelId}).save()
        await channel.save()
        await this.ctx.user.save()

        return channel
    }

    async unSubscribe(userId, channelId){
        const channel = await this.User.findById(channelId)

        if(!channel) this.ctx.throw(422, "channel 不存在")

        const subscription = await this.Subscription.findOne({user:userId, channel:channelId})
        if(subscription){
            await subscription.remove()
        }

        channel.subscriberCount--
        this.ctx.user.subscribedCount--

        await channel.save()
        await this.ctx.user.save()

        return channel
    }

    async getChannelInfo(channelId){
        return await this.User.findById(channelId)
    }

    async isSubscribed(userId, channelId){
        const subscription = await this.Subscription.findOne({user: userId, channel: channelId})
        return subscription ? true : false
    }

    async getSubscriptions(userId){
        let subscriptions = await this.Subscription.find({user:userId}).populate('channel')
        return subscriptions.map(item => {
            return this.ctx.helper._.pick(item.channel, ["id", "username", "avatar"])
        })
    }
}

module.exports = UserService
