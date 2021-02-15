const MemeController = require('../controller/meme-controller');
const express = require('express');
var Ddos = require('ddos');
var ddos = new Ddos({burst:1, limit:3});

const router = express.Router();

//Routes for Meme Operations
//GET ALL
router.get("/",MemeController.get);
//GET BY ID
router.get('/:id',MemeController.getById);
//POST
router.post('/',ddos.express,MemeController.post);
//PATCH
router.patch('/:id', ddos.express,MemeController.patch);
//GET TOP 10
router.get('/top10/:frame',MemeController.getTop10);

module.exports = router;