// Import necessary packages
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

// Stripe
const stripe = require("stripe")(
  "sk_test_51QAtQ2CTfbFpWnW8pnGnI78SCJx319PcM23AcTxCIgOrEJxePqTVhlWXwNH17oSUrvpzBJdTZcOdR7NyCRt2Vrqr00sHOxvlz3"
);

// Import models
const ImageModel = require("./models/imageModel");
const PostModel = require("./models/postModel");
const StoreModel = require("./models/storeModel");
const LoginModel = require("./models/loginModel");
const CarouselModel = require("./models/carouselModel");

const Store = require("./models/storeModel");

//cloudinary apis etc
cloudinary.config({
  cloud_name: "ddcdmrhio",
  api_key: "987898687194257",
  api_secret: "o-zdYyiI7pREemCS5-yf9dedvfM",
});

// Initialize dotenv to load environment variables
dotenv.config();
console.log("MongoDB URI:", process.env.URI);

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

//Initialize bcrypt for password hashing
const bcrypt = require("bcrypt");

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

//Login

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await LoginModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found", token: null });
    }
    const isMatch = await bcrypt.compare(password, user.password); // katsotaan vastaako salasana hashattua salasanaa
    if (isMatch) {
      const token = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: 86400 }
      );
      res
        .status(200)
        .json({
          message: "Login successful",
          token: token,
          username: user.username,
        });
    } else {
      res.status(401).json({ message: "Invalid credentials", token: null });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Check if 'uploads' directory exists, if not, create it
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// MongoDB Connection
(async () => {
  try {
    if (!process.env.URI) {
      throw new Error("URI is not defined in the .env file");
    }

    await mongoose.connect(process.env.URI);
    console.log("Connected to MongoDB");

    const client = mongoose.connection.getClient();
    const db = client.db("kukua");

    const collections = await db.listCollections().toArray();
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
})();

// Multer setup for handling image uploads
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Use timestamp to make filenames unique
  },
});

const upload = multer({ storage }).single("testImage");

// API Endpoints

// GET: Fetch all data from the 'store' collection
app.get("/getStore", async (req, res) => {
  try {
    const data = await StoreModel.find({});
    res.status(200).json(data); // Kuva polku sisältyy jo `data`-objektiin
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: About page content

app.get("/getPost", async (req, res) => {
  try {
    const data = await PostModel.find({});
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch all data from the 'carousel' collection
app.get("/getCarousel", async (req, res) => {
  try {
    const data = await CarouselModel.find({});
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*PUT: Update a document in the 'store' collection*/

app.put("/editItem/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedItem = await Store.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Item updated successfully", data: updatedItem });
  } catch (error) {
    res.status(500).json({ error: "Error updating item" });
  }
});

// PUT: Update a document in the 'post' collection

app.put("/editPost/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Post updated successfully", data: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Error updating post" });
  }
});

//POST: Add data to the 'store' collection
app.post("/addData", upload, async (req, res) => {
  try {
    const { product_name, description, description_big, price, Numberress } =
      req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      // Tallennetaan kuva Cloudinaryyn
      folder: "kukua",
    });

    const newStore = new StoreModel({
      _id: new mongoose.Types.ObjectId(),
      product_name,
      description,
      description_big,
      price,
      imagePath: req.file ? `${result.secure_url}` : null, // Tallennetaan kuvan polku
    });

    await newStore.save(); // Tallennetaan tietokantaan
    res
      .status(201)
      .json({ message: "Data added successfully", data: newStore });
    fs.unlinkSync(req.file.path); // Poistetaan tallennettu kuva
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

//POST: Add carousel image path and text.
app.post("/addCarousel", upload, async (req, res) => {
  try {
    const { text } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      // Tallennetaan kuva Cloudinaryyn
      folder: "kukuacarousel",
    });

    const newCarousel = new CarouselModel({
      text,
      imagePath: req.file ? `${result.secure_url}` : null,
    });
    await newCarousel.save();
    res
      .status(201)
      .json({ message: "Carousel added successfully", data: newCarousel });
    fs.unlinkSync(req.file.path); // Poistetaan tallennettu kuva
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST: Add a new post to the 'post' collection
app.post("/addPost", upload, async (req, res) => {
  try {
    const { title, content } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      // Tallennetaan kuva Cloudinaryyn
      folder: "kukuaposts",
    });

    const newPost = new PostModel({
      title,
      content,
      imagePath: req.file ? `${result.secure_url}` : null,
    });
    await newPost.save();
    res.status(201).json({ message: "Post added successfully", data: newPost });
    fs.unlinkSync(req.file.path); // Poistetaan tallennettu kuva
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Delete a document from the 'store' collection
app.delete("/deleteItem/:id", async (req, res) => {
  try {
    const { id } = req.params; // Käytä id:tä, ei _id:tä

    // Tarkista, onko id kelvollinen MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Käytä new avainsanaa luodaksesi ObjectId
    const response = await Store.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (response.deletedCount === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res
      .status(200)
      .json({ message: "Item deleted successfully", data: response });
  } catch (err) {
    console.error("Error during deletion:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE: Delete post from the 'post' collection

app.delete("/deletePost/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const response = await PostModel.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (response.deletedCount === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res
      .status(200)
      .json({ message: "Post deleted successfully", data: response });
  } catch (err) {
    console.error("Error during deletion:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// // POST: Upload an image to the server and save to MongoDB
// app.post("/upload", upload, async (req, res) => {
//     try {
//         // Check if a file is uploaded
//         if (!req.file) {
//             return res.status(400).json({ message: 'No file uploaded' });
//         }

//         const newImage = new ImageModel({
//             name: req.file.originalname,
//             image: {
//                 data: fs.readFileSync(path.join(__dirname, '/uploads/', req.file.filename)),
//                 contentType: req.file.mimetype
//             },
//         });
//         // Save image document to MongoDB
//         await newImage.save();

//         res.status(200).json({ message: 'Image uploaded successfully' });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: err.message });
//     }
// });

// Routes for stripe payment system
app.post("/create-checkout-session", async (req, res) => {
  const { products } = req.body;

  console.log(products);

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: product.name,
        images: [product.image],
      },
      unit_amount: Math.round(product.price * 100),
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    billing_address_collection: 'required',
    shipping_address_collection: {
        allowed_countries: ['FI']
    },
    line_items: lineItems,
    mode: "payment",
    success_url: `http://localhost:5173/success`,
    cancel_url: `http://localhost:5173/cancel`,
  });

  res.json({ id: session.id });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
