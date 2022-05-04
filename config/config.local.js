const secret = require('./secret')

module.exports = {
    HASH_KEY: "SECRET",
    TOKEN_EXPIRE: '7d',
    ...secret
};