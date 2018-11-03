var router = require("express").Router();
var Order = require("../models/Order");
var Faculty = require("../models/Faculty");
var OrderItem = require("../models/OrderItem");
var Item = require("../models/Item");
var Notification = require("../models/Notification");

// MIDDLEWARE
var isLoggedIn = require("../middleware/isLoggedIn");
var isAdmin = require("../middleware/isAdmin");

// UTIL METHODS
var asyncForEach = require("../Utils/AsyncForEach");

//to place an order
router.post('/', isLoggedIn, (req, res) => {
    var qty = req.body.qty;
    var id = req.body.id;
    var name = req.body.name;

    console.log(qty, id, name);

    // console.log(req.body.id);
    var orderItemsres = serializeParams(id, qty, name);
    Faculty.findById(req.user._id)
        .then(fac => {
            var newOrder = new Order({
                faculty: fac
            });

            newOrder.save()
                .then((orderRes) => {

                    for (index = 0; index < orderItemsres.length; index++) {
                        var newOrderItem = new OrderItem({
                            order: orderRes._id,
                            item: orderItemsres[index].id,
                            quantity: Number(orderItemsres[index].qty)
                        });

                        newOrderItem.save();

                    }
                    res.redirect("/dashboard");
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

router.post("/process", isLoggedIn, isAdmin, async (req, res) => {
    let quantitySuppliedArr = [].concat(req.body.quantitySupplied);
    let itemIdArr = [].concat(req.body.itemId);
    let flagOrderSave = false;

    await asyncForEach(quantitySuppliedArr, async (quantitySupplied, i) => {
        let orderItem = await OrderItem.findById(itemIdArr[i]);
        if (!flagOrderSave) {
            let order = await Order.findById(orderItem.order);
            order.status = "PROCESSED";
            await order.save();
            flagOrderSave = true;
            var notifText = "Your Order No. " + order._id + " has been processed on " + (new Date().toLocaleDateString());
            var newNotification = new Notification({
                subject: "ORDER",
                text: notifText,
                target: order.faculty
            });

            await newNotification.save();
        }
        orderItem.quantitySupplied = quantitySupplied;
        orderItem = await orderItem.save();
        let item = await Item.findById(orderItem.item).exec();
        item.quantity -= orderItem.quantitySupplied;
        await item.save();
    });

    res.redirect("/dashboard");
});

router.get("/:id", isLoggedIn, (req, res) => {
    Order.findById(req.params.id)
        .then(order => {
            if (order) {
                OrderItem.find({
                        order: order._id
                    })
                    .populate("item")
                    .then(items => {
                        res.render("order/details", {
                            order: order,
                            items: items,
                            user: req.user
                        });
                    });
            } else {
                res.status(404).send({
                    message: "Order not found"
                });
            }
        });
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

function serializeParams(id, qty, name) {
    let orderObj = [];

    for (let index = 0; index < id.length; index++) {
        let item = {};

        if (qty[index] != "0" && qty[index] != "") {
            item.id = id[index];
            item.qty = qty[index];
            item.name = name[index];
            orderObj.push(item);
        }
    }

    console.log(orderObj);

    return orderObj;
}

module.exports = router;