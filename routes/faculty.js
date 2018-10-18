
let   {faculty}  =  require('../models/Faculty');
let router = require("express").Router();

//to sign up faculty
router.post('/register', (req,res)=> {

});

//basic routes
//TODO: for login
router.post('/login', (req,res)=> {

});

//orders placed on dashboard if not admin
router.get('/dashboard', (req, res)=> {
    var userId = _.pick(req.body, ['fac_id']);
    var isAdmin = faculty.isUserAdmin(userId) ;

    if(!isAdmin) {
        order.findOrderByFacId(userToken).then((doc)=> {
            res.send(doc);
        }, (err)=> {
            res.status(400).send({errorMsg:env_vars.errMsg});
            console.log(err);
        });
    } else {
        //show all the orders
        order.find().then((doc)=> {
          res.send(doc);
        }, (err)=> {
            res.status(400).send({errorMsg:env_vars.errMsg});
            console.log(err);
        })

    }
});

module.exports = router;