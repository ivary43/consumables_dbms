let  {mongoose} = require('../db/mongoose');

var orderSchema = new mongoose.Schema({
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty"
    },
    status: {
        type: String,
        enum: ['PENDING', 'PROCESSED'],
        default: 'PENDING'
    }
});

//Todo: complete it with passport or jwt
orderSchema.methods.findOrderByFacId = function(token) {

};

module.exports = mongoose.model("order", orderSchema);