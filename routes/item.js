let {item}  =  require('../models/Item');
let router  = require("express").Router();

//to fetch the items while ordering
router.get('/', (req, res)=> {
    item.find().then((docs)=> {
        res.send(docs);
    },(err)=> {
        res.status(400).send({errorMsg:env_vars.errMsg});
        console.log(err);
    });
});

module.exports = router;