module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const LikeSchema = new Schema({
        like: {
            type: Number,
            enum: [1, -1], //赞和踩
            require: true
        },
        user: {
            type: mongoose.ObjectId,
            require: true,
            ref: "User"
        },
        video: {
            type: mongoose.ObjectId,
            require: true,
            ref: "Video"
        }
    }, { versionKey: false, timestamps: true })

    return mongoose.model('VideoLike', LikeSchema);
}