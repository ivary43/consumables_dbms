var Faculty = require('../models/Faculty');
var Order = require("../models/Order");
var OrderItem = require("../models/OrderItem");
let router = require("express").Router();
const _ = require('lodash');
var passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');
var Notification = require("../models/Notification");

// MIDDLEWARES
var isLoggedIn = require("../middleware/isLoggedIn");

//TODO: 1) Only the admin should be able to register other faculties
//      2) Check for duplicate entries and give error accordingly
router.post('/register', (req, res) => {
    var name = req.body.name;
    var user = req.body.username;
    var password = req.body.password;

    Faculty.findOne({
            username: user
        })
        .then(res_user => {
            if (res_user) {
                res.send({
                    message: "Faculty already exists"
                });
            } else {
                Faculty.register(new Faculty({
                    username: user,
                    name: name
                }), password, (err, account) => {
                    if (err) {
                        console.log(err);
                        res.send({
                            message: "Error in registering"
                        });
                    } else {
                        res.status(201).send(account);
                    }

                });
            }
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

// router.get("/faculty/:id/makeAdmin", (req, res) => {
//     Faculty.findById(req.params.id)
//         .then(faculty => {
//             faculty.isAdmin = true;
//             faculty.save()
//                 .then(faculty => {
//                     res.send(faculty);
//                 });
//         })
//         .catch(err => {
//             console.log(err);
//         });
// });

// router.get("/faculty/:id/removeAdmin", (req, res) => {
//     Faculty.findById(req.params.id)
//         .then(faculty => {
//             faculty.isAdmin = false;
//             faculty.save()
//                 .then(faculty => {
//                     res.send(faculty);
//                 });
//         })
//         .catch(err => {
//             console.log(err);
//         });
// });

//basic routes
router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/dashboard");
    } else {
        res.render("faculty/login");
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect("/dashboard");
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureMessage: 'Wrong credentials'
}), (req, res) => {
    res.redirect('/dashboard');
});



//orders placed on dashboard if not admin
router.get('/dashboard', isLoggedIn, (req, res) => {

    if (!req.user.isAdmin) {

        Order.find({
                faculty: req.user._id
            })
            .sort([
                ['createdAt', -1]
            ])
            .then(orders => {

                let orderDetails = {};

                OrderItem.find({})
                    .populate("item")
                    .then(orderItems => {

                        orderItems.forEach(orderItem => {
                            console.log(orderItem.order);
                            if(!_.has(orderDetails, orderItem.order)) {
                                orderDetails[orderItem.order] = [];
                            }
                            orderDetails[orderItem.order].push(orderItem);
                        });
                        
                        res.render("faculty/dashboard", {
                            orders: orders,
                            user: req.user,
                            orderDetails: orderDetails,
                            notifications: []
                        });
                    })
                    .catch(err => {
                        res.status(400).send({
                            errorMsg: env_vars.errMsg
                        });
                        console.log(err);
                    });
            })
            .catch(err => {
                res.status(400).send({
                    errorMsg: env_vars.errMsg
                });
                console.log(err);
            });

    } else {
        //show all the orders
        Order.find({}).populate("faculty")
            .sort([
                ['createdAt', -1]
            ])
            .then(orders => {
                //    console.log(orders);
                res.render("faculty/dashboard", {
                    orders: orders,
                    user: req.user
                });
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