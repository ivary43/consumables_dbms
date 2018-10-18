var router = require("express").Router();
var Order = require("../models/Order");
var Faculty = require("../models/Faculty");

//to place an order
router.post('/', (req, res) => {
    
    Faculty.findById("5bc85800b4b3b22191af7037")
        .then(fac => {
            var newOrder = new Order({
                faculty: fac
            });

            newOrder.save()
                .then(order => res.status(201).send(order))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

// ONLY FOR DEBUGGING
router.get("/", (req, res) => {
    Order.find({}).populate("faculty")
        .then(orders => {
            res.status(200).send(orders);
        })
        .catch(err => console.log(err));
});

// ONLY FOR DEBUGGING
router.delete("/", (req, res) => {
    Order.deleteMany({})
        .then(() => res.send("Success"));
});

module.exports = router;