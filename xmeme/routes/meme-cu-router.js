const MemeController = require('../controller/meme-controller');
const express = require('express');

const router = express.Router();

//Routes for Meme Operations
//POST
router.post('/',MemeController.post);
//PATCH
router.patch('/:id',MemeController.patch);

module.exports = router;