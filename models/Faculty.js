let {mongoose} = require('../db/mongoose');

var facultySchema = new mongoose.Schema({
    name: {
        type: String,
        minlength:3,
        trim:true,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }, 
    username : {
        type: String,
        minlength: 4,
        trim: true,
        required: true
    }, 
    password: {
        type: String,
        minlength: 6,
        trim: true,
        required: true
    }

});


//TODO: complete this
facultySchema.methods.isUserAdmin = function(tokenId) {
  return this.isAdmin;
};

module.exports = mongoose.model("faculty", facultySchema);