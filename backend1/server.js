const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

// Connect to the database
mongoose.connect("mongodb+srv://mongo:mongo@cluster0.al24ajm.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Product schema
const productSchema = new mongoose.Schema({
  customId: Number,
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

// Create the Product model
const Product = mongoose.model("Product", productSchema);

// API Routes

// Home route
app.get("/", (req, res) => {
  res.send("Express App is running for Products");
});

// Get all products
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

// Add a new product
app.post("/products", async (req, res) => {
  try {
    const lastProduct = await Product.findOne().sort({ customId: -1 });
    const customId = lastProduct && !isNaN(lastProduct.customId) ? lastProduct.customId + 1 : 1;

    const product = new Product({
      customId,
      name: req.body.name,
      size: req.body.size,
      price: req.body.price,
      amount: req.body.amount,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a product by customId
app.put("/products/:customId", async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { customId: req.params.customId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product by customId
app.delete("/products/:customId", async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ customId: req.params.customId });
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
