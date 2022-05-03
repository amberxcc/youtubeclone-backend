module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const CommentSchema = new Schema({
        content: {
            type: String,
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

    return mongoose.model('Comment', CommentSchema);
}