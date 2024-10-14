// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Import models
const ImageModel = require('./models/imageModel');


// Initialize dotenv to load environment variables
dotenv.config();
console.log('MongoDB URI:', process.env.URI)

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Check if 'uploads' directory exists, if not, create it
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// MongoDB Connection
(async () => {
    try {
        if (!process.env.URI) {
            throw new Error('URI is not defined in the .env file');
        }

        await mongoose.connect(process.env.URI);
        console.log("Connected to MongoDB");

        const client = mongoose.connection.getClient();
        const db = client.db("kukua");

        const collections = await db.listCollections().toArray();
        console.log(collections);
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
})();

// Schema for the 'Store' collection
const StoreSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product_name: String,
    description: String,
    description_big: String,
    price: Number,
    imagePath: String // Tallennetaan kuvan tiedostopolku
});

const Store = mongoose.model('Store', StoreSchema, 'store');

// Multer setup for handling image uploads
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Use timestamp to make filenames unique
    }
});

const upload = multer({ storage }).single('testImage');

// API Endpoints

// GET: Fetch all data from the 'store' collection
app.get("/getStore", async (req, res) => {
    try {
        const data = await Store.find({});
        res.status(200).json(data); // Kuva polku sisältyy jo `data`-objektiin
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



//POST: Add data to the 'store' collection
app.post("/addData", upload, async (req, res) => {
    try {
        const { product_name, description, description_big, price, Numberress } = req.body;

        const newStore = new Store({
            _id: new mongoose.Types.ObjectId(),
            product_name,
            description,
            description_big,
            price,
            imagePath: req.file ? `/uploads/${req.file.filename}` : null // Tallennetaan kuvan polku
        });

        await newStore.save(); // Tallennetaan tietokantaan
        res.status(201).json({ message: 'Data added successfully', data: newStore });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
    

// POST: Upload an image to the server and save to MongoDB
app.post("/upload", upload, async (req, res) => {
    try {
        // Check if a file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const newImage = new ImageModel({
            name: req.file.originalname,
            image: {
                data: fs.readFileSync(path.join(__dirname, '/uploads/', req.file.filename)),
                contentType: req.file.mimetype
            }
        });

        // Save image document to MongoDB
        await newImage.save();

        res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});