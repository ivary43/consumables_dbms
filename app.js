
const  env_vars = require('./Utils/Constants.js') ;
const  express = require('express');
const body_parser = require('body-parser');
const _ = require('lodash');

let faculty = require("./routes/faculty");
let item = require("./routes/item");
let order = require("./routes/order");
let orderItem = require("./routes/orderItem");

let app = express();
app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());

app.set('view engine', 'ejs');
app.use(express.static("public"));

// ROUTES
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