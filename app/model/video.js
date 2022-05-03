module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const VideoSchema = new Schema({
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        playUrl: {
            type: String,
            required: true
        },
        cover: {
            type: String,
            require: true
        },
        user: {
            type: mongoose.ObjectId,
            require: true,
            ref: "User"
        },
    }, { versionKey: false, timestamps: true })

    return mongoose.model('Video', VideoSchema);
}