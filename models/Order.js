var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    },
    status: {
        type: String,
        enum: ['PENDING', 'PROCESSED']
    }
});

module.exports = mongoose.model("order", orderSchema);