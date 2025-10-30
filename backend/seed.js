import mongoose from "mongoose";
import Product from "./models/Product.js";

const MONGO_URI =
  "mongodb+srv://amitkumar345:adi34567@cluster0.b4pc1x7.mongodb.net/?appName=cluster0";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
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
