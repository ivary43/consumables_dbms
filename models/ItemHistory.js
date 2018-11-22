let {mongoose} = require('../db/mongoose');

var itemHistorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    curr_quantity: {
        type: Number,
        required: true,
    }, updatedBy: {
        type: Number,
        required: true,
    }, dateUpdated: {
        type:Date,
        default:  Date.now
    }, item_id :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "item"   
    }
});

module.exports = mongoose.model("itemHistory", itemHistorySchema);