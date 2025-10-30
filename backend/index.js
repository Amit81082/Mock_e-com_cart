// ✅ Step 14 — MongoDB Persistence Integrated

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
  .connect("mongodb://127.0.0.1:27017/vibe_cart")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------- TEST ROUTE ----------
app.get("/", (req, res) => {
  res.send("✅ Backend server is running successfully!");
});

// ======================================================
// 1️⃣ GET /api/products — Fetch all products from DB
// ======================================================
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
  //  I can fetch products from an external API(fake store API) as well
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// ======================================================
// 2️⃣ POST /api/cart — Add item to cart (MongoDB)
// ======================================================
app.post("/api/cart", async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if already in cart
    let existingItem = await CartItem.findOne({ productId });

    if (existingItem) {
      existingItem.qty += qty;
      await existingItem.save();
    } else {
      existingItem = await CartItem.create({
        productId,
        name: product.name,
        price: product.price,
        qty,
      });
    }

    const cart = await CartItem.find();
    res.json({
      message: `${product.name} added to cart 🛍️!`,
      cart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding to cart" });
  }
});

// ======================================================
// 3️⃣ GET /api/cart — View all cart items + total
// ======================================================
app.get("/api/cart", async (req, res) => {
  try {
    const cart = await CartItem.find();
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    res.json({ cart, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// ======================================================
// 4️⃣ DELETE /api/cart/:id — Remove an item by productId
// ======================================================
app.delete("/api/cart/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const deleted = await CartItem.findOneAndDelete({ productId });

    if (!deleted) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const cart = await CartItem.find();
    res.json({ message: "Item removed from cart", cart });
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
