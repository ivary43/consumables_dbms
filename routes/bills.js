let router = require("express").Router();
let Bills = require("../models/Bills");
var isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", isLoggedIn, (req, res)=> {
    res.render("bills/bills", {user:req.user});
});

router.post("/", isLoggedIn, (req, res)=> {
    console.log(req.body);
    console.log(req.files);
   
   var tempBills = new Bills({
       pdfData:req.files.file_pdf.data,
       topic: req.body.topic,
       description: req.body.description,
       fileName : req.files.file_pdf.name
   });
   tempBills.save().then((bill)=>{
    res.redirect("/bills");
   }).catch((err)=>{
       console.log(err);
       res.send({msg:"error while saving"});
   }); 

});

router.get("/view", isLoggedIn,(req, res)=> {
   Bills.find().then((bills)=> {
       res.render("bills/view_bills",{user:req.user, bills});
   }, (err)=> {
       res.send({msg:"Oops something went wrong"});
       console.log(err);
   }); 
});

module.exports = router;