var OrderItem = require('../models/OrderItem');
var Item = require("../models/Item");
let router = require("express").Router();
var Order = require("../models/Order");
const _ = require('lodash');

// TODO : 1) Allow only admin to change quality supplied column
router.post('/', (req, res) => {
    var userToken = _.pick(req.body, ['token_id']);
    // var isAdmin = faculty.isAdmin(userToken);

    Order.findById("5bc86329cb09162c18ba5839")
        .then(order => {
            var itemArr = ["5bc85e906b113b28eca97766", "5bc85e806b113b28eca97764"];
            itemArr.forEach(item => {
                Item.findById(item)
                .then(it => {
                    var newOrderItem = new OrderItem({
                        order: order,
                        item: it,
                        quantity: Math.floor(Math.random() * 100)
                    });

                    newOrderItem.save();
                });
            });
        });
});


// ONLY FOR DEBUGGING
router.get("/", (req, res) => {
    OrderItem.find({})
    .populate("order")
    .populate("item")
    .populate("faculty")
    .then(orderItem => {
        res.status(200).send(orderItem);
    })
    .catch(err => console.log(err));
});

module.exports = router;