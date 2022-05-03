const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { HASH_KEY, TOKEN_EXPIRE } = require('../../config/local')

module.exports = {
    slugify(text) {
        return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    },

    myHash(str) {
        return crypto.createHmac('md5', HASH_KEY).update(str).digest('hex')
    },

    jwtSign(jsonData) {
        return jwt.sign(jsonData, HASH_KEY, { expiresIn: TOKEN_EXPIRE })
    },

    jwtVerify(token) {
        return jwt.verify(token, HASH_KEY)
    },
};