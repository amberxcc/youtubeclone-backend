module.exports = (option = { required: true }) => {
    return async (ctx, next) => {
        const { User } = ctx.app.model
        const { jwtVerify, jwtDecode } = ctx.helper
        const token = ctx.headers.authorization?.substr(7)

        // 若携带token，则进行验证
        if (token) {

            // 先尝试从缓存中找jwt是否有效
            const userId = await ctx.app.redis.get(token)
            console.log('redis找的了.........')

            // 如果缓存中有则不需要计算验证
            if(userId){
                ctx.user = await User.findById(userId)
                return await next()
            }

            // 如果缓存中没有则需要计算验证，再保存到缓存中
            const id = jwtVerify(token, ctx.app.config.keys).id
            const user = await User.findById(id)
            if (user){
                const result = jwtDecode(token, ctx.app.config.keys)
                const ex = result.exp - Math.round(new Date() / 1000) 
                await ctx.app.redis.setex(token, ex > 3600 ? 3600 : ex, user.id)
                console.log('写入redis...过期时间：',ex)
                ctx.user = user
            }else
                return ctx.status = 401 // token存在，但验证失败

        }
        
        // 没有携带token，但api需要验证
        if (!token && option.required) {
            return ctx.status = 401
        }

        await next()
    }
}