//Instantiating DB
require('dotenv').config();
require('./db/db');

const bodyParser = require('body-parser');
const memeRouter = require('./routes/meme-router');
const viewsRouter = require('./routes/views-router');
const path = require('path');
const express = require('express');
const boom = require('express-boom');

const app = express();

const port = process.env.PORT || 3000;

app.set('view engine','ejs');
app.use(boom());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')));


//API: Meme Related Calls & Operations
app.use('/memes',memeRouter);
//Views Endpoints
app.use('/',viewsRouter);
//Handle Unknown Paths
app.use('*',function(req,res){
    res.status(404);
    res.send('Resource Not Found');
});

app.listen(port,function(e){
    console.log('App Listening on port',port);
});