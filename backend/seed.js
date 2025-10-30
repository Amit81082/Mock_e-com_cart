const mongoose = require("mongoose");
const Product = require("./models/Product.js");
require("dotenv").config();


const seedData = async () => {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await Product.deleteMany();
    await Product.insertMany([
      { name: "Laptop", price: 60000 },
      { name: "Mobile", price: 20000 },
      { name: "Headphones", price: 1500 },
      { name: "Mouse", price: 500 },
      { name: "Keyboard", price: 1000 },
      { name: "Monitor", price: 30000 },
      { name: "Tablet", price: 40000 },
    ]);

    console.log("✅ Products seeded!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding:", err);
  }
};

seedData();
