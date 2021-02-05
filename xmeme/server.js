//Instantiating DB
require('dotenv').config();
require('./db/db');

const bodyParser = require('body-parser');
const memeRouter = require('./routes/meme-route');
const express = require('express');
const app = express();

const port = process.env.port || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Meme Related Calls & Operations
app.use('/meme',memeRouter);

//Home Page
app.get("/",async (req,res)=>{
    return res.send("Service API Running");
});

app.listen(port,function(e){
    console.log('App Listening on port',port);
});