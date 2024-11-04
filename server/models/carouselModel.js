const mongoose = require('mongoose');

const CarouselSchema = new mongoose.Schema({
    text: {
        type: String,
        required: false
    },
    imagePath: {
        type: String,
        required: true
    }
});

const CarouselModel = mongoose.model('Carousel', CarouselSchema, 'carousel');

module.exports = CarouselModel;