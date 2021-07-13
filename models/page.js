let mongoose = require('mongoose');

//Article Schema
let pageSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
});

let Page = module.exports = mongoose.model('Page', pageSchema);