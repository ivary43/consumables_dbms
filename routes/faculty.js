var Faculty = require('../models/Faculty');
var Order = require("../models/Order");
let router = require("express").Router();
const _ = require('lodash');

//TODO: 1) Only the admin should be able to register other faculties
//      2) Check for duplicate entries and give error accordingly
router.post('/register', (req, res) => {
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;

    var newFaculty = new Faculty({
        name: name,
        username: username,
        password: password
    });



    newFaculty
        .save()
        .then(fac => {
            res.status(201).send(fac);
        })
        .catch(err => {
            console.log(err);
            res.send({
                message: "Error in registering"
            });
        });
});


// ONLY FOR DEBUGGING AND TESTING
router.get("/faculty", (req, res) => {
    Faculty.find({})
        .then(faculties => {
            res.status(200).send(faculties);
        })
        .catch(err => console.log(err));
});

//basic routes
//TODO: for login
router.post('/login', (req, res) => {

});

//orders placed on dashboard if not admin
router.get('/dashboard', (req, res) => {
    var userId = _.pick(req.body, ['fac_id']);
    // var isAdmin = Faculty.isUserAdmin(userId);
    var isAdmin = false;

    if (!isAdmin) {

        Order.find({faculty: "5bc85800b4b3b22191af7037"})
        .then(orders => {
            res.render("faculty/dashboard", {orders: orders});
        })
        .catch(err => {
            res.status(400).send({
                errorMsg: env_vars.errMsg
            });
            console.log(err);
        });

    } else {
        //show all the orders
        Order.find({})
        .then(orders => {
            res.render("faculty/dashboard", {orders: orders});
        })
        .catch(err => {
            res.status(400).send({
                errorMsg: env_vars.errMsg
            });
            console.log(err);
        });

    }
});

module.exports = router;