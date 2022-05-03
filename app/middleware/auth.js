module.exports = (option = { required: true }) => {
    return async (ctx, next) => {
        const { jwtVerify } = ctx.helper
        const token = ctx.headers.authorization?.substr(6)

        if (token) {
            const result = jwtVerify(token)
            const user = await ctx.model.User.findById(result.id)
            if (user)
                ctx.user = user
            else
                return ctx.status = 401

        } else if (!token && option.required) {
            return ctx.status = 401
        }

        await next()
    }
}