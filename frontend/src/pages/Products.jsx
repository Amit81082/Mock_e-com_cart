import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Products.css";

const API_URL = import.meta.env.VITE_API_URL;

function Products() {
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null); // track which product is being added

  // ✅ Fetch products from backend
  useEffect(() => {
    const cached = localStorage.getItem("products");
    if (cached) setProducts(JSON.parse(cached)); // show instantly

    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/products`);
        setProducts(data);
        localStorage.setItem("products", JSON.stringify(data)); // cache for next load
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
      setMessages((prev) => ({
        ...prev,
        [productId]: "✅ " + (res.data.message || "Added to cart!"),
      }));

      // ✅ instantly clear message after 1.5s
    setTimeout(() => {
      setMessages((prev) => ({ ...prev, [productId]: "" }));
    }, 1500);
    } catch (err) {
      console.error(err);
      setMessages((prev) => ({ ...prev, [productId]: "❌ Error adding" }));
      setTimeout(() => {
        setMessages((prev) => ({ ...prev, [productId]: "" }));
      }, 1500);
    } finally {
      setAdding(null);
    }
  };

  return (
    <div className="container">
      <h1>🛍️ Vibe Commerce - Products</h1>

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
              {/* ✅ Show message for this product only */}
              {messages[p._id] && <p className="message">{messages[p._id]}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Products;
