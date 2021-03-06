
const  env_vars = require('./Utils/Constants.js') ;
const  express = require('express');
const body_parser = require('body-parser');
const _ = require('lodash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const logger = require('morgan');
const  passport_config = require('./config/passport_config');
const fileUpload = require('express-fileupload');
var flash = require('connect-flash');
const rimraf = require('rimraf');
var cron = require('node-cron');

let faculty = require("./routes/faculty");
let item = require("./routes/item");
let order = require("./routes/order");
let orderItem = require("./routes/orderItem");
let inventory = require("./routes/inventory");
let bills = require("./routes/bills");
let history = require("./routes/history");

let app = express();
app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());
app.use(logger('dev'));
app.use(fileUpload());
app.use(flash());
app.use(require('express-session')({
    secret: env_vars.secretCode,
    resave: false,
    saveUninitialized: false,
    cookie: {_expires: 24 * 60 * 60 * 1000}
}));


app.use(passport.initialize());
app.use(passport.session({}));

app.set('view engine', 'ejs');
app.use(express.static("public"));
passport_config.config_passport(passport);
// passport.use(new LocalStrategy())


// ROUTES

app.get("/", (req, res) => {
    res.redirect("/dashboard");
});

app.use(faculty);
app.use("/orderItems", orderItem);
app.use("/order", order);
app.use("/orderItem", orderItem);
app.use("/item", item);
app.use("/inventory", inventory);
app.use("/bills", bills);
app.use("/history", history);

//404
app.use(function (req, res, next) {
    res.status(404);
    // respond with html page
    res.render('error/error_404', { url: req.url,user: req.user });
    // res.send("no");
    return;
  });
  

const listenPort = process.env.PORT  || env_vars.PORT_NUMBER ;

//server setup
app.listen(listenPort, ()=>{
    console.log('The server is running at :', listenPort);
});

//cron job to clear clutter
cron.schedule('24 58 3 * * *', ()=> {
    rimraf('files/*.pdf',(err)=> {
        console.log(err);
    });
});
