const MemeController = require('../controller/meme-controller');
const express = require('express');


const router = express.Router();

router.get("/",MemeController.get);
router.get('/:id',MemeController.getById);
router.post('/',MemeController.post);
router.patch('/:id',MemeController.patch);

module.exports = router;