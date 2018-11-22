let router = require("express").Router();
var ItemHistory = require('../models/ItemHistory');

// MIDDLEWARE
var isLoggedIn = require("../middleware/isLoggedIn");
var isAdmin = require("../middleware/isAdmin");

router.get("/",isLoggedIn, isAdmin, (req, res)=> {
    ItemHistory.find().then((histories)=> {
        res.render("history/itemHistory",
         {histories:histories, user: req.user});
    });
}, (err)=> {
    res.status(400).send({
        errorMsg: env_vars.errMsg
    });
    console.log(err);
});







module.exports = router