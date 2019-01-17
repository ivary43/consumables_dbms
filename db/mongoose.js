const mongoose = require('mongoose');
const config_var = require('../config/config');
mongoose.Promise = global.Promise ;

mongoose.connect(`mongodb://localhost:27017/consumables`,
    { useNewUrlParser: true })
    .catch((err)=> {
       console.log(err);
    });

module.exports = {
    mongoose
};