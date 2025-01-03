const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: false
    }
});

const PostModel = mongoose.model('Post', PostSchema, 'post');

module.exports = PostModel;