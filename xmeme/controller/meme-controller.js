const Meme = require('../models/meme');
const mongoose = require('mongoose');

module.exports.get = async (req,res)=>{
    //If id in query instead, then redirect to getById handler
    if(req.query.id) return this.getById(req,res);
    
    let memes = await Meme.find({}).sort({created:-1}).limit(100);
    
    res.status(200);
    res.json(memes);
}

module.exports.getById = async (req,res)=>{
    var id = req.params.id || req.query.id;

    if(id && mongoose.Types.ObjectId.isValid(id)){
        let meme = await Meme.findById(id);
        if(meme != null){
            res.status(200);
            return res.json(meme);
        }else{
            res.status(404);
            return res.json({});
        }
    }
    res.status(400);
    return res.json({});
}

module.exports.post = async (req,res)=>{
    let params = req.query;

    let name = params["name"];
    let url = params["url"];
    let caption = params["caption"];
    const created = new Date();

    let meme = new Meme({name,url,caption, created});

    var alreadyExist = await Meme.findOne({name,url,caption});
    if(alreadyExist != null){
        res.status(409);
        return res.json({});
    }
    var result = await meme.save();

    res.status(201);
    res.json({'id':result._id});
}

module.exports.patch = async (req,res)=>{
    var updatedMeme = req.body;
    var id = req.params.id;
    
    var result = await Meme.updateOne({_id  : new mongoose.Types.ObjectId(id)}, {$set: updatedMeme});
    return res.json(result);
}