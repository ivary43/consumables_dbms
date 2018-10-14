
const  env_vars = require('./Utils/Constants.js') ;
const  express = require('express');

let app = express();
app.set('view engine', 'ejs');

const listenPort = env_vars.PORT_NUMBER || process.env.PORT ;



app.listen(listenPort, ()=>{
    console.log('The server is running at :', listenPort);
});

