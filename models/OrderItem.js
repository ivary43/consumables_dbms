var mongoose = require("mongoose");

var orderItemSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    },
    quantity: {
        type: Number,
        required: true
    },
    quantitySupplied: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("OrderItem", orderItemSchema);