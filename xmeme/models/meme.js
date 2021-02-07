const mongoose = require('mongoose');
const normalize = require('normalize-mongoose');

//Meme Schema
const memeSchema = new mongoose.Schema({
    id:String,
    name: String,
    url:String,
    caption: String,
    created: Date,
    likes:{ 
        type: Number,
        default : 0
    }
});

//Convert _id to id
memeSchema.plugin(normalize);

module.exports = mongoose.model('Meme',memeSchema);