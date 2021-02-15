const MemeController = require("../controller/meme-controller");
const express = require("express");

//Cock Block Setup
const ExpressBrute = require("express-brute");
const MongooseStore = require("express-brute-mongoose");
const BruteForceSchema = require("express-brute-mongoose/dist/schema");
const mongoose = require("mongoose");

const model = mongoose.model(
  "bruteforce",
  new mongoose.Schema(BruteForceSchema)
);
const store = new MongooseStore(model);

const bruteforce = new ExpressBrute(store,{
    freeRetries: 5,
    minWait: 60*60*1000,
    maxWait: 60*60*1000
});
//END: Cock Block Setup


const router = express.Router();

//Routes for Meme Operations
//GET ALL
router.get("/", MemeController.get);
//GET BY ID
router.get("/:id", MemeController.getById);
//POST
router.post("/", bruteforce.prevent, MemeController.post);
//PATCH
router.patch("/:id", bruteforce.prevent, MemeController.patch);
//GET TOP 10
router.get("/top10/:frame", MemeController.getTop10);

module.exports = router;
