const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const ImageModel = require('./models/imageModel');

dotenv.config();

app.use(cors());
app.use(express.json());


if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit the process with failure
    });

const StoreSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    first_name: String,
    last_name: String,
    email: String,
    gender: String,
    ip_address: String
});

const Store = mongoose.model('Store', StoreSchema, 'store');

// Multer setup
const Storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: Storage
}).single('testImage');

app.get("/getStore", async (req, res) => {
    try {
        const data = await Store.find({});
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

app.post("/upload", upload, async (req, res) => {
    try {
        const newImage = new ImageModel({
            name: req.file.originalname,
            image: {
                data: fs.readFileSync(path.join(__dirname, '/uploads/', req.file.filename)),
                contentType: 'image/png'
            }
        });
        await newImage.save();
        res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});