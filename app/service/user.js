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

    async findUserById(userId){
        return await this.User.findById(userId)
    }

    async createNewUser(data){
        data.password = this.ctx.helper.myHash(data.password)
        const user = new this.User(data)
        await user.save()
        return user
    }

    async updateUser(userId, data){
        return await this.User.findByIdAndUpdate(userId, data, {new: true, useFindAndModify: false})
    }

    async subscribe(userId, channel){

        if(await this.Subscription.findOne({user:userId, channel:channel.id})){
            return channel
        }

        channel.subscriberCount++
        this.ctx.user.subscribedCount++

        await Promise.all([
            new this.Subscription({user:userId, channel: channel.id}).save(),
            channel.save(),
            this.ctx.user.save()
        ])

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
