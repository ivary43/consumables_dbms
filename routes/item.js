var Item = require('../models/Item');
let router = require("express").Router();

//to fetch the items while ordering
router.get('/', (req, res) => {
    Item.find().then((items) => {
        res.send(items);
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