module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const HistorySchema = new Schema({
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

    return mongoose.model('History', HistorySchema);
}