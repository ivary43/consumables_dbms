var router = require("express").Router();
var Order = require("../models/Order");
var Faculty = require("../models/Faculty");
var OrderItem = require("../models/OrderItem");

// MIDDLEWARE
var isLoggedIn = require("../middleware/isLoggedIn");

//to place an order
router.post('/', isLoggedIn, (req, res) => {
    var qty = req.body.qty ;
    var id = req.body.id ;
    var name = req.body.name ;

    console.log(req.body.id);
    var orderItemsres = serializeParams(id,qty,name) ;    
    Faculty.findById(req.user._id)
        .then(fac => {
            var newOrder = new Order({
                faculty: fac
            });

            
            newOrder.save()
                .then((orderRes)=>{
                   
                    for(index=0;index<orderItemsres.length;index++) {
                        var newOrderItem = new OrderItem ({
                            order: orderRes._id,
                            item: orderItemsres[index].id,
                            quantity: Number(orderItemsres[index].qty)
                        });

                        newOrderItem.save();

                    }
                    res.status(200).send({stat:"success"});
                })
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

function serializeParams (id, qty, name) {
    let orderObj = [];
    let items ={};

    for(let index =0 ;index<id.length ;index++) {
        if(qty[index]!="0" ||qty[index]!="") {
            items.id = id[index];
            items.qty = qty[index];
            items.name = name[index];
            orderObj.push(items);
        }
    }

    return orderObj;
};

module.exports = router;