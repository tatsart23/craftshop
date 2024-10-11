const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    }
});

const ImageModel = mongoose.model('Image', ImageSchema);

module.exports = ImageModel;