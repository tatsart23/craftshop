// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Stripe
const stripe = require('stripe')("sk_test_51QAtQ2CTfbFpWnW8pnGnI78SCJx319PcM23AcTxCIgOrEJxePqTVhlWXwNH17oSUrvpzBJdTZcOdR7NyCRt2Vrqr00sHOxvlz3");

// Import models
const ImageModel = require('./models/imageModel');


// Initialize dotenv to load environment variables
dotenv.config();
console.log('MongoDB URI:', process.env.URI)

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

//Initialize bcrypt for password hashing
const bcrypt = require('bcrypt');

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

//Login

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Login.findOne({username})
        if (!user) {
            return res.status(404).json({ message: 'User not found', token: null });
        }
        const isMatch = await bcrypt.compare(password, user.password); // katsotaan vastaako salasana hashattua salasanaa
        if (isMatch) {
            const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: 86400 }); 
            res.status(200).json({ message: 'Login successful', token: token, username: user.username });
        } else {
            res.status(401).json({ message: 'Invalid credentials', token: null });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


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

//Schema for login
const LoginSchema = new mongoose.Schema({
    username: String,
    password: String
});

const Login = mongoose.model('Login', LoginSchema, 'logintesti');


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

// DELETE: Delete a document from the 'store' collection
app.delete("/deleteItem/:id", async (req, res) => {
    try {
        const { id } = req.params;  // Käytä id:tä, ei _id:tä
        
        // Tarkista, onko id kelvollinen MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        // Käytä new avainsanaa luodaksesi ObjectId
        const response = await Store.deleteOne({ _id: new mongoose.Types.ObjectId(id) });

        if (response.deletedCount === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json({ message: 'Item deleted successfully', data: response });
    } catch (err) {
        console.error('Error during deletion:', err);
        res.status(500).json({ error: 'Internal Server Error' });
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

// Routes for stripe payment system
app.post("/create-checkout-session", async (req, res) => {
    const { products } = req.body;

    console.log(products);

    const lineItems = products.map((product) => ({
        price_data: {
            currency: 'eur',
            product_data: {
                name: product.name,
                // images: ["https://i0.wp.com/pearlyarts.com/wp-content/uploads/2023/06/FREE-Umbrella-Clipart-WM.png?fit=1000%2C1000&ssl=1"]
            },
            unit_amount: Math.round(product.price * 100)
        },
        quantity: product.quantity
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `http://localhost:5173/success`,
        cancel_url: `http://localhost:5173/cancel`
    });

    res.json({ id: session.id });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});