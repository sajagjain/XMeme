//Instantiating DB
require('dotenv').config();
require('./db/db');

const bodyParser = require('body-parser');
const memeRouter = require('./routes/meme-route');
const express = require('express');
const app = express();

const port = process.env.port || 8080;

app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));


//API
//Meme Related Calls & Operations
app.use('/meme',memeRouter);

//Views
//Home Page
app.get("/",async (req,res)=>{
    return res.render('pages/index');
});


app.listen(port,function(e){
    console.log('App Listening on port',port);
});