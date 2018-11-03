let router = require("express").Router();
var Item = require('../models/Item');
var isLoggedIn = require("../middleware/isLoggedIn");
let _ = require("lodash");
var Notification = require("../models/Notification");


// MIDDLEWARE
var isLoggedIn = require("../middleware/isLoggedIn");
var isAdmin = require("../middleware/isAdmin");

// UTIL METHODS
var asyncForEach = require("../Utils/AsyncForEach");

router.get("/", isLoggedIn, isAdmin, (req, res) => {
    Item.find().then((items) => {
        res.render("item/updateItem", {
            items: items,
            user: req.user
        });
    }, (err) => {
        res.status(400).send({
            errorMsg: env_vars.errMsg
        });
        console.log(err);
    });
});

router.post("/", isLoggedIn, isAdmin, (req, res) => {
    let ids = req.body.id;
    let quantities = req.body.qty;
    let processed = 0;
    for (let i = 0; i < ids.length; ++i) {
        Item.findByIdAndUpdate(ids[i], {
            $set: {
                quantity: quantities[i]
            }
        }, {
            new: true
        }).then((doc) => {
            if (doc) {
                processed++;
            }

            if (processed === ids.length && i === ids.length - 1) {
                res.redirect("/inventory");
            } else if (processed !== ids.length && i === ids.length - 1) {
                res.status(400).send({
                    message: "Error while updating"
                });
            }
        }).catch((err) => {
            console.log(err);
            res.status(400).send({
                message: "Error while updating"
            });
        })
    }
})

router.post("/add", isLoggedIn, isAdmin, async (req, res) => {
    let items = serialiseParams([].concat(req.body.name), [].concat(req.body.qty));

    console.log(items);

    await asyncForEach(items, async (item, i) => {
        let newItem = new Item({
            name: item.name,
            quantity: item.quantity
        });

        await newItem.save();
        var notifText = "New item - " + newItem.name + " has been added to the inventory";
        var newNotification = new Notification({
            subject: "ITEM_ADD",
            text: notifText,
            isAll: true
        });

        await newNotification.save();
    });

    res.status(200).send({
        msg: "OK"
    });
});

function serialiseParams(name, qty) {
    let newItems = [];

    for (let i = 0; i < qty.length; ++i) {
        let item = {};
        if (!_.isEmpty(name[i]) && !_.isEmpty(qty[i])) {
            item.name = name[i];
            item.quantity = qty[i];
            newItems.push(item);
        }

    }

    return newItems;
}

module.exports = router