const { myHash } = require('../extend/helper')

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const UserSchema = new Schema({
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            set: str => myHash(str),
        },
        avatar: {
            type: String,
            default: null
        },
        cover: {
            type: String,
            default: null
        },
        chanelDescription: {
            type: String,
            default: null
        },
    }, { versionKey: false, timestamps: true })

    return mongoose.model('User', UserSchema);
}