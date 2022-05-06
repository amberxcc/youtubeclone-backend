module.exports = (option = { required: true }) => {
    return async (ctx, next) => {
        const { User } = ctx.app.model
        const { jwtVerify, jwtDecode } = ctx.helper
        const token = ctx.headers.authorization?.substr(7)

        if (token) {
            const userId = await ctx.app.redis.get(token)
            if(userId){
                ctx.user = await User.findById(userId)
                return await next()
            }

            const user = await User.findById(jwtVerify(token).id)
            if (user){
                const result = jwtDecode(token)
                const ex = result.exp - Math.round(new Date() / 1000) 
                await ctx.app.redis.setex(token, ex > 3600 ? 3600:ex, user.id)
                ctx.user = user
            }else
                return ctx.status = 401

        }
        
        if (!token && option.required) {
            return ctx.status = 401
        }

        await next()
    }
}