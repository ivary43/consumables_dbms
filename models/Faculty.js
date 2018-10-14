var mongoose = require("mongoose");

var facultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("faculty", facultySchema);