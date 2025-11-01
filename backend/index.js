// ✅ Step 14 — MongoDB Persistence Integrated


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const CartItem = require("./models/CartItem");



const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());

// ---------- MONGODB CONNECTION ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


// ---------- TEST ROUTE ----------
app.get("/", (req, res) => {
  res.send("✅ Backend server is running successfully!");
});

// ======================================================
// 1️⃣ GET /api/products — Fetch all products from DB
// ✅ Get all products fast
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().lean(); // lean() = faster
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// ✅ Add to cart (optimized)
app.post("/api/cart", async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const product = await Product.findById(productId).lean();

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update or create in one go
    let item = await CartItem.findOneAndUpdate(
      { productId },
      { $inc: { qty: qty } },
      { new: true }
    );

    if (!item) {
      item = await CartItem.create({
        productId,
        name: product.name,
        price: product.price,
        qty,
      });
    }

    const cart = await CartItem.find().lean();
    res.json({
      message: `${product.name} added to cart 🛍️!`,
      cart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding to cart" });
  }
});

// ✅ Get cart (fast)
app.get("/api/cart", async (req, res) => {
  try {
    const cart = await CartItem.find().lean();
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    res.json({ cart, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// ✅ Remove item
app.delete("/api/cart/:id", async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    const cart = await CartItem.find().lean();
    res.json({ cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error removing item" });
  }
});


// ======================================================
// 5️⃣ POST /api/checkout — Simulate checkout
// ======================================================
app.post("/api/checkout", async (req, res) => {
  try {
    const { Name, email } = req.body;
    const cartItems = await CartItem.find();

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty!" });
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    const receipt = {
      Name,
      email,
      total,
      timestamp: new Date().toLocaleString(),
    };

    // Clear cart after checkout
    await CartItem.deleteMany();

    res.json({ message: "Order placed successfully!! 🎉", receipt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Checkout failed" });
  }
});

// ======================================================
// ✅ SERVER START
// ======================================================
const PORT =  5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});



app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});
