module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const SubscriptionSchema = new Schema({
        user: {
            type: mongoose.ObjectId,
            require: true,
            ref: "User"
        },
        channel: {
            type: mongoose.ObjectId,
            require: true,
            ref: "User"
        }
    }, { versionKey: false, timestamps: true })

    return mongoose.model('Subscription', SubscriptionSchema);
}