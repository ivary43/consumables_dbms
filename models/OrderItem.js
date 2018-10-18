let  {mongoose} = require('../db/mongoose');

var orderItemSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order"
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "item"
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