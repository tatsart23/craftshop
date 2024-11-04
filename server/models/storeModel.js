const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product_name: String,
    description: String,
    description_big: String,
    price: Number,
    imagePath: String // Tallennetaan kuvan tiedostopolku
});

const Store = mongoose.model('Store', StoreSchema, 'store');

module.exports = Store;