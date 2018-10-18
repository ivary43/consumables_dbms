
const  env_vars = require('./Utils/Constants.js') ;
const  express = require('express');
const body_parser = require('body-parser');
const _ =require('lodash');

let   {faculty}  =  require('./models/Faculty');
let   {item}  =  require('./models/Item');
let   {order}  =  require('./models/Order');
let   {OrderItem}  =  require('./models/OrderItem');


let app = express();
app.set('view engine', 'ejs');

const listenPort = env_vars.PORT_NUMBER || process.env.PORT ;

//server setup
app.listen(listenPort, ()=>{
    console.log('The server is running at :', listenPort);
});

app.use(body_parser.json());


//basic routes
//TODO: for login
app.post('/login', (req,res)=> {

});


//to fetch the items while ordering
app.get('/items', (req, res)=> {
     item.find().then((docs)=> {
         res.send(docs);
     },(err)=> {
         res.status(400).send({errorMsg:env_vars.errMsg});
         console.log(err);
     })

});


//orders placed on dashboard if not admin
app.get('/dashboard', (req, res)=> {
    var userId = _.pick(req.body, ['fac_id']);
    var isAdmin = faculty.isUserAdmin(userId) ;

    if(!isAdmin) {
        order.findOrderByFacId(userToken).then((doc)=> {
            res.send(doc);
        }, (err)=> {
            res.status(400).send({errorMsg:env_vars.errMsg});
            console.log(err);
        })
    } else {
        //show all the orders
        order.find().then((doc)=> {
          res.send(doc);
        }, (err)=> {
            res.status(400).send({errorMsg:env_vars.errMsg});
            console.log(err);
        })

    }
});


//to place an order
app.post('/order', (req, res)=> {


});

//to update the orders accessible by admin only
app.post('/order_items', (req, res)=> {
    var userToken = _.pick(req.body, ['token_id']);
    var isAdmin = faculty.isAdmin(userToken) ;

    if(isAdmin) {

    } else {
       res.status(401).send({errorMsg:"Unauthorised access"});
    }

});

//to sign up faculty
app.post('/register', (req,res)=> {

});
