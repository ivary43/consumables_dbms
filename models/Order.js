let {
    mongoose
} = require('../db/mongoose');
let {
    MongooseAutoIncrementID
} = require('mongoose-auto-increment-reworked');

var orderSchema = new mongoose.Schema({
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "faculty"
    },
    status: {
        type: String,
        enum: ['PENDING', 'PROCESSED', 'DELIVERED'],
        default: 'PENDING'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    processedAt: {
        type: Date
    },
    confirmedAt: {
        type: Date
    },
    specialRequest: {
        type: String,
        default: "-"
    },
    specialRequestRemark: {
        type: String
    }
});

//Todo: complete it with passport or jwt
orderSchema.methods.findOrderByFacId = function (token) {

};

orderSchema.plugin(MongooseAutoIncrementID.plugin, {
    modelName: "order",
    field: "orderId"
});

module.exports = mongoose.model("order", orderSchema);