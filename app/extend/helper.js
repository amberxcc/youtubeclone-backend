const crypto = require('crypto')
const _ = require('lodash')
const jwt = require('jsonwebtoken')

module.exports = {
    _: _,

    myHash(str) {
        return crypto.createHmac('md5', this.config.keys).update(str).digest('hex')
    },

    jwtSign(jsonData) {
        return jwt.sign(jsonData, this.config.keys, {
            expiresIn: this.config.token.TOKEN_EXPIRE
        })
    },

    jwtVerify(token, key) {
        return jwt.verify(token, key)
    },

    jwtDecode(token, key) {
        return jwt.decode(token, key)
    },

};