let router = require("express").Router();
var Item = require('../models/Item');
var isLoggedIn = require("../middleware/isLoggedIn");
let _ = require("lodash");

router.get("/", (req, res)=> {
Item.find().then((items)=>{
    res.render("item/updateItem", {
        items:items
    });
}, (err)=> {
    res.status(400).send({
        errorMsg: env_vars.errMsg
    });
    console.log(err);
    });
});

router.post("/", (req, res)=> {
    console.log("/", req.body );
    let ids = req.body.id ;
    let quantities = req.body.qty ;
    let processed = 0 ;
    for(let i=0;i<ids.length ;++i) {
        Item.findByIdAndUpdate(ids[i], 
            {$set: {quantity:quantities[i]}},
            {new: true}
            ).then((doc)=> {
                    if(doc) {
                        processed++;
                    } 

                    if(processed===ids.length && i===ids.length-1) {
                        res.redirect("/inventory");
                    } else if (processed!==ids.length && i===ids.length-1) {
                        res.status(400).send({ message: "Error while updating"});
                    }
            }).catch((err)=> {
                console.log(err);
                res.status(400).send({ message: "Error while updating"});
            })

    } 
    
})

router.post("/add", (req, res)=> {
    
    let items = serialiseParams(req.body.name, req.body.qty);
   // console.log(items);
    res.status(200).send({msg:"OK"});

});

function serialiseParams(name, qty) {
    let newItems = [];

    for(let i=0 ;i<qty.length;++i) {
        let item = {};
        if(!_.isEmpty(name[i]) && !_.isEmpty(qty[i])) {
            item.name = name[i];
            item.quantity = qty[i];
            newItems.push(item);
        }

    }

    return newItems ;
}

module.exports = router
