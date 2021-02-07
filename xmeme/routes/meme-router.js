const MemeController = require('../controller/meme-controller');
const express = require('express');


const router = express.Router();

//Routes for Meme Operations
//GET ALL
router.get("/",MemeController.get);
//GET BY ID
router.get('/:id',MemeController.getById);
//POST
router.post('/',MemeController.post);
//PATCH
router.patch('/:id',MemeController.patch);
//GET TOP 10
router.get('/top10/:frame',MemeController.getTop10);

module.exports = router;