import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Products.css";

const API_URL = import.meta.env.VITE_API_URL;

function Products() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  // ✅ Fetch products from backend (MongoDB)
  useEffect(() => {
    axios
      .get(`${API_URL}/api/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // ✅ Add to Cart function
  const addToCart = async (productId) => {
    try {
      const res = await axios.post(`${API_URL}/api/cart`, {
        productId,
        qty: 1,
      });
      setMessage(res.data.message || "Added to cart!");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setMessage("Error adding to cart");
    }
  };

  return (
    <div className="container">
      <h1>🛍️ Vibe Commerce - Products</h1>

      {/* ✅ Success/Error Message */}
      {message && <p className="message">{message}</p>}

      {/* ✅ Product Grid */}
      <div className="grid">
        {products.map((p) => (
          <div key={p._id} className="card">
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
            <button onClick={() => addToCart(p._id)} className="add-btn">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
