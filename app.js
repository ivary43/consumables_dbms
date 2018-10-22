
const  env_vars = require('./Utils/Constants.js') ;
const  express = require('express');
const body_parser = require('body-parser');
const _ = require('lodash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const logger = require('morgan');
const  passport_config = require('./config/passport_config');

let faculty = require("./routes/faculty");
let item = require("./routes/item");
let order = require("./routes/order");
let orderItem = require("./routes/orderItem");

let app = express();
app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());
app.use(logger('dev'));

app.use(require('express-session')({
    secret: env_vars.secretCode,
    resave: false,
    saveUninitialized: false
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


const listenPort = env_vars.PORT_NUMBER || process.env.PORT ;

//server setup
app.listen(listenPort, ()=>{
    console.log('The server is running at :', listenPort);
});