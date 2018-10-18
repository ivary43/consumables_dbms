const mongoose = require('mongoose');
const config_var = require('../config');
mongoose.Promise = global.Promise ;

mongoose.connect(`mongodb://${config_var.username}:${config_var.pass}@ds131743.mlab.com:31743/consumables_iitp`,
    { useNewUrlParser: true })
    .catch((err)=> {
       console.log(err);
    });

module.exports = {
    mongoose
};