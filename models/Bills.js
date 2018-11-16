let {mongoose} = require('../db/mongoose');

var billSchema = new mongoose.Schema({
    uploadedAt: {
        type: Date,
        default: Date.now
    }, pdfData: {
        type: Buffer,
        required: true
    }, topic: {
         type: String,
         required: true   
    }, description: {
        type: String
    }, fileName : {
        type: String, 
        required: true
    }
});
module.exports = mongoose.model("bill", billSchema);