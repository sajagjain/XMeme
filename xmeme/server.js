const cluster = require('cluster');
const cCPUs = require('os').cpus().length;
const requestIp = require('request-ip');

//Instantiating DB
require('dotenv').config();
require('./db/db');

const bodyParser = require('body-parser');
const memeRouter = require('./routes/meme-router');
const viewsRouter = require('./routes/views-router');
const path = require('path');
const express = require('express');
const boom = require('express-boom');

if (cluster.isMaster) {
    // Create a worker for each CPU
    for (var i = 0; i < cCPUs; i++) {
        cluster.fork();
    }

    cluster.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' is online.');
    });
    cluster.on('exit', function (worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died.');
    });
}
else {

    const app = express();

    const port = process.env.PORT || 3000;

    app.set('view engine', 'ejs');
    app.use(boom());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(requestIp.mw());
 
    app.use(function(req, res, next) {
        const ip = req.clientIp;
        console.log('Client IP:'+ip);
        next();
    });

    //API: Meme Related Calls & Operations
    app.use('/memes', memeRouter);
    //Views Endpoints
    app.use('/', viewsRouter);
    //Handle Unknown Paths
    app.use('*', function (req, res) {
        res.status(404);
        res.send('Resource Not Found');
    });

    app.listen(port, function (e) {
        console.log('App Listening on port', port);
    });
}