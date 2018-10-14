
const  env_vars = require('./Utils/Constants.js') ;
const  express = require('express');
const  hbs = require('hbs');

let app = express();
app.set('view engine', 'hbs');

const listenPort = env_vars.PORT_NUMBER || process.env.PORT ;



app.listen(listenPort, ()=>{
    console.log('The server is running at :', listenPort);
});

