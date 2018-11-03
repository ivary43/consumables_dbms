var mongoose = require("mongoose");

var NotificationSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    subject: {
        type: String,
        enum: ['ORDER', 'ITEM_ADD'],
        required: true
    },
    text: {
        type: String,
        required: true
    },
    target: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'faculty'
    },
    isAll: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Notification", NotificationSchema);