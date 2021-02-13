const Meme = require('../models/meme');
const mongoose = require('mongoose');
const cache = require('memory-cache');
const isImage = require('is-image-url');

module.exports.get = async (req, res) => {
    try {
        //If id in query instead, then redirect to getById handler
        if (req.query.id) return this.getById(req, res);

        //Caching Records Output for Performance
        let memes;
        var cached_memes = cache.get('memes');
        if (cached_memes !== null) {
            memes = cached_memes;
        } else {
            memes = await Meme.find({}).sort({ created: -1 }).limit(100);
            cache.put('memes', memes, 1500);
        }

        //Send Success with Data
        res.status(200);
        res.json(memes);
    } catch (err) {
        res.boom.badRequest('Server Error', err);
    }
}

module.exports.getById = async (req, res) => {
    try {
        var id = req.params.id || req.query.id;

        //If Id not empty and also of type Object Id
        if (id && mongoose.Types.ObjectId.isValid(id)) {

            //Caching Result for Performance
            let meme;
            let cached_meme = cache.get(id);
            if (cached_meme !== null) {
                meme = cached_meme;
            } else {
                meme = await Meme.findById(id);
                cache.put(id, meme, 1500);
            }

            //Meme Found
            if (meme != null) {
                res.status(200);
                return res.json(meme);
            }
            //Meme Not Found
            else {
                res.status(404);
                return res.json({});
            }
        }
        //Bad Request
        res.status(400);
        return res.json({});
    } catch (err) {
        //Bad Request
        res.boom.badRequest('Server Error', err);
    }
}

module.exports.post = async (req, res) => {
    try {
        let body = req.body;

        let name = body["name"];
        let url = body["url"];
        let caption = body["caption"];
        const created = new Date();

        const isValidImage = isImage(url);
        
        //Check if Data
        if (body && name && url && isValidImage) {
            let meme = new Meme({ name, url, caption, created });

            var alreadyExist = await Meme.findOne({ name, url, caption });

            //Check if already exists
            if (alreadyExist != null) {
                res.status(409);
                return res.json({});
            }
            var result = await meme.save();

            // //Remove Memes from Cache for consistency
            // cache.del('memes');
            // cache.del('frame1');
            // cache.del('frame7');
            // cache.del('frame30');

            //Send Created
            res.status(201);
            res.json({ 'id': result._id });
        } else {
            res.boom.badRequest('Server Error', err);
        }
    } catch (err) {
        //Bad Request
        res.boom.badRequest('Server Error', err);
    }
}

module.exports.patch = async (req, res) => {
    try {
        var updatedMeme = req.body;
        var id = req.params.id;

        let isValidImage = true;
        if(req.body["url"] !== undefined){
             isValidImage = isImage(req.body["url"]);
        }
       
        //Check if data is not null
        if (id != null && mongoose.Types.ObjectId.isValid(id) && updatedMeme != null && isValidImage) 
        {
            var result = await Meme.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: updatedMeme });

            // //Remove Memes & id from cache for consistency
            // cache.del('memes');
            // cache.del(id);
            // cache.del('frame1');
            // cache.del('frame7');
            // cache.del('frame30');

            //Send Success
            return res.json(result);
        } else {
            res.boom.badRequest('Server Error', err);
        }
    } catch (err) {
        //Bad Request
        res.boom.badRequest('Server Error', err);
    }
}

module.exports.getTop10 = async (req, res) => {
    try {
        //Check if frame is provided
        if (!req.params.frame) {
            res.status(400);
            return res.json([]);
        }

        var frame = parseInt(req.params.frame);

        var start;
        var end = new Date();

        //If frame for 1 day, 1 week or 1 month
        if (frame == 1 || frame == 7 || frame == 30) {
            start = new Date(new Date().getTime() - frame * 86400000);
        }
        //If not frame in above send Bad Request
        else {
            res.status(400);
            return res.json([]);
        }

        let result;
        var cached_memes = cache.get('frame' + frame);
        if (cached_memes !== null) {
            result = cached_memes;
        } else {
            result = await Meme.find({ created: { "$gte": start, "$lt": end } }).sort({ likes: -1 }).limit(10);
            cache.put('frame' + frame, result, 1500);
        }

        return res.json(result);
    } catch (err) {
        //Bad Request
        res.boom.badRequest('Server Error', err);
    }
}