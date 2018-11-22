let router = require("express").Router();
var Item = require('../models/Item');
var ItemHistory = require('../models/ItemHistory');
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

router.post("/", isLoggedIn, isAdmin, async (req, res) => {
    let ids = [].concat(req.body.id);
    // let quantities = [].concat(req.body.qty);
    let updateBy = [].concat(req.body.updateby);
    let processed = 0;

    await asyncForEach(ids, async (id, i) => {
        let item = await Item.findById(id);
        if(updateBy[i]!=="0"){
            let itemHistory = new ItemHistory({
                name: item.name,
                curr_quantity:item.quantity,
                updatedBy:updateBy[i],
                item_id:id
            });
            await itemHistory.save();
        } 
      
        item.quantity = Number(item.quantity) + Number(updateBy[i]);
        await item.save();
        
    });

    res.redirect("/inventory");
})

router.post("/add", isLoggedIn, isAdmin, async (req, res) => {
    let items = serialiseParams([].concat(req.body.name), [].concat(req.body.qty));

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

    res.redirect("/inventory");
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