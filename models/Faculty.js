let {mongoose} = require('../db/mongoose');



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


//TODO: complete this
facultySchema.methods.isUserAdmin = function(tokenId) {
  return false ;
};
module.exports = mongoose.model("faculty", facultySchema);