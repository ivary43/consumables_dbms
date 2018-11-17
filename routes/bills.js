let router = require("express").Router();
let Bills = require("../models/Bills");
var isLoggedIn = require("../middleware/isLoggedIn");
const fs = require("fs");

router.get("/", isLoggedIn, (req, res) => {
    res.render("bills/bills", {
        user: req.user
    });
});

router.post("/", isLoggedIn, (req, res) => {
    var tempBills = new Bills({
        pdfData: req.files.file_pdf.data,
        topic: req.body.topic,
        description: req.body.description,
        fileName: req.files.file_pdf.name
    });
    tempBills.save().then((bill) => {
        res.redirect("/bills");
    }).catch((err) => {
        console.log(err);
        res.send({
            msg: "error while saving"
        });
    });

});

router.get("/view", isLoggedIn, (req, res) => {
    Bills.find({}, {
        pdfData: 0
    }).then((bills) => {
        res.render("bills/view_bills", {
            user: req.user,
            bills: bills
        });
    }, (err) => {
        res.send({
            msg: "Oops something went wrong"
        });
        console.log(err);
    });
});

router.post("/download", isLoggedIn, (req, res) => {

    Bills.findById(req.body.id, {
        pdfData: 1,
        fileName: 1
    }).then(async (bill) => {
        const fileName = req.user._id + new Date().getMilliseconds();
        console.log(fileName);
        let filesVar = await fs.writeFile(`files/${fileName}.pdf`, bill.pdfData, 'binary', (err) => {
            if (err) throw err;
            console.log('Sucessfully download!');
            res.download(`files/${fileName}.pdf`, bill.fileName);
        });

    }).catch((err) => {
        res.send({
            msg: "Error while downloading"
        });
        console.log(err);
    })
});

module.exports = router;