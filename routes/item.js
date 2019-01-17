var Item = require('../models/Item');
var Faculty = require("../models/Faculty");
let router = require("express").Router();

// MIDDLEWARES
var isLoggedIn = require("../middleware/isLoggedIn");

//to fetch the items while ordering
router.get('/', isLoggedIn, (req, res) => {
    Item.find().then((items) => {
        if (req.user.isAdmin) {
            Faculty.find()
            .then((faculties) => {
                res.render("item/orderItem", {
                    items: items,
                    user: req.user,
                    faculties: faculties
                });
            });
        } else {
            res.render("item/orderItem", {
                items: items,
                user: req.user
            });
        }
    }, (err) => {
        res.status(400).send({
            errorMsg: env_vars.errMsg
        });
        console.log(err);
    });
});


//TODO: ADD MIDDLEWARE TO MAKE SURE ONLY THE ADMIN CAN ADD ITEMS
router.post("/", (req, res) => {
    var name = req.body.name;
    var quantity = Number(req.body.quantity);

    var newItem = new Item({
        name,
        quantity
    });

    newItem.save()
        .then(item => {
            res.status(201).send(newItem);
        })
        .catch(err => {
            console.log(err);
        });
});

module.exports = router;