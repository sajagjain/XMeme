const mongoose = require('mongoose');
const normalize = require('normalize-mongoose');


// const autoIncrement = require("mongodb-autoincrement");

// autoIncrement.setDefaults({
//     collection: "counters",     // collection name for counters, default: counters
//     step: 1,                    // auto increment step
// });

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

memeSchema.plugin(normalize);

// memeSchema.plugin(autoIncrement.mongoosePlugin);

module.exports = mongoose.model('Meme',memeSchema);