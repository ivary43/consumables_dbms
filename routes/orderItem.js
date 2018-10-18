let   {OrderItem}  =  require('../models/OrderItem');
let router = require("express").Router();

//to update the orders accessible by admin only
router.post('/orderItems', (req, res)=> {
    var userToken = _.pick(req.body, ['token_id']);
    var isAdmin = faculty.isAdmin(userToken) ;

    if(isAdmin) {

    } else {
       res.status(401).send({errorMsg:"Unauthorised access"});
    }

});

module.exports = router;