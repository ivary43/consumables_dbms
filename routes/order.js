var router = require("express").Router();
var Order = require("../models/Order");
var Faculty = require("../models/Faculty");
var OrderItem = require("../models/OrderItem");
var Item = require("../models/Item");
var Notification = require("../models/Notification");
var mailer = require("../Utils/mailer");
const nodemailer = require('nodemailer');
var ejs = require("ejs");


// MIDDLEWARE
var isLoggedIn = require("../middleware/isLoggedIn");
var isAdmin = require("../middleware/isAdmin");

// UTIL METHODS
var asyncForEach = require("../Utils/AsyncForEach");

var placedOrderId;
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
                    placedOrderId = orderRes._id;
                    for (index = 0; index < orderItemsres.length; index++) {
                        var newOrderItem = new OrderItem({
                            order: orderRes._id,
                            item: orderItemsres[index].id,
                            quantity: Number(orderItemsres[index].qty)
                        });

                        newOrderItem.save();

                    }
                    let mailOptions = createOrderRegisteredMailOption(req.user.email);
                    console.log(mailOptions);
                    console.log(mailer.transporter);
                    mailer.transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: %s', info.messageId);
                        // Preview only available when sending through an Ethereal account
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    });
                    res.redirect("/dashboard");
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

router.delete("/:id", isLoggedIn, (req, res) => {

    Order.findById(req.params.id)
        .then(order => {
            if (!order) {
                res.status(404).send({
                    message: "Order not found"
                });
            } else if (order.status === "PROCESSED") {
                res.status(403).send("Cannot delete processed order");
            } else {
                Order.findByIdAndDelete(req.params.id)
                    .then(() => {
                        res.send("Order " + req.params.id + " deleted successfully.");
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        })
        .catch(err => {
            console.log(err);
        });
});

// to update the order {User -> admin} 
router.post("/process", isLoggedIn, isAdmin, async (req, res) => {
    let quantitySuppliedArr = [].concat(req.body.quantitySupplied);
    let itemIdArr = [].concat(req.body.itemId);
    let itemNameArr = [].concat(req.body.itemName);
    let orderProcessed = serializeParams(itemIdArr, quantitySuppliedArr, itemNameArr);

    let flagOrderSave = false;
    console.log(req.body);
    var process_order_id;
    await asyncForEach(quantitySuppliedArr, async (quantitySupplied, i) => {
        let orderItem = await OrderItem.findById(itemIdArr[i]);
        if (!flagOrderSave) {
            let order = await Order.findById(orderItem.order);
            if (order.status === "PROCESSED") {
                res.status(403).send({
                    message: "Order already processed"
                });
            }
            order.status = "PROCESSED";
            await order.save();
            flagOrderSave = true;
            var notifText = "Your Order No. " + order._id + " has been processed on " + (new Date().toLocaleDateString());
            var newNotification = new Notification({
                subject: "ORDER",
                text: notifText,
                target: order.faculty
            });
            process_order_id = order._id;
            await newNotification.save();
        }
        orderItem.quantitySupplied = quantitySupplied;
        orderItem = await orderItem.save();
        let item = await Item.findById(orderItem.item).exec();
        item.quantity -= orderItem.quantitySupplied;
        await item.save();
    });



    //render the html file
    ejs.renderFile(__dirname + "/../views/template/mail_template.ejs", {
        ordersProcessed: orderProcessed
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            mailProcessedOption = createOrderProcessedMailOption(req.user.email, process_order_id, data);
            console.log(mailProcessedOption);
            console.log(mailer.transporter);
            mailer.transporter.sendMail(mailProcessedOption, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });

        }

    })

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

//creates the mail options accordingly 
function createOrderRegisteredMailOption(user_email) {
    let var_mailOptions = {
        from: '<consumables@iitp.ac.in>', // sender address
        to: user_email, // list of receivers
        subject: 'Your order ' + placedOrderId + ' has successfully been placed', // Subject line
        text: 'Your order has successfully been placed. You will get a confirmation mail once order has been processed. \n Thank you! \n\n\n  Manish Kumar \nIIT Patna \n Consumables pic'
    }
    return var_mailOptions;

}

function createOrderProcessedMailOption(user_email, orderID, data) {
    let pr_mailOptions = {
        from: '<consumables@iitp.ac.in>', // sender address
        to: user_email, // list of receivers
        subject: 'Your order ' + orderID + ' has successfully be processed', // Subject line
        html: data
    }
    return pr_mailOptions;
}

module.exports = router;