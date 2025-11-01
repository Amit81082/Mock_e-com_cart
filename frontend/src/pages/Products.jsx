import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Products.css";

const API_URL = import.meta.env.VITE_API_URL;

function Products() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null); // track which product is being added

  // ✅ Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/products`);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Add to Cart function (instant + smooth UX)
  const addToCart = async (productId) => {
    setAdding(productId); // show loading for that button
    try {
      const res = await axios.post(`${API_URL}/api/cart`, {
        productId,
        qty: 1,
      });
      setMessage("✅ " + (res.data.message || "Added to cart!"));

      // ✅ instantly clear message after 1.5s
      setTimeout(() => setMessage(""), 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error adding to cart");
      setTimeout(() => setMessage(""), 1500);
    } finally {
      setAdding(null);
    }
  };

  return (
    <div className="container">
      <h1>🛍️ Vibe Commerce - Products</h1>

      {/* ✅ Message */}
      {message && <p className="message">{message}</p>}

      {/* ✅ Product Grid */}
      <div className="grid">
        {loading ? (
          <p>Loading products...</p>
        ) : (
          products.map((p) => (
            <div key={p._id} className="card">
              <h3>{p.name}</h3>
              <p>₹{p.price}</p>
              <button
                onClick={() => addToCart(p._id)}
                className="add-btn"
                disabled={adding === p._id}
              >
                {adding === p._id ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Products;
