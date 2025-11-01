import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Cart.css";

const API_URL = import.meta.env.VITE_API_URL;

function Cart() {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [form, setForm] = useState({ Name: "", email: "" });
  const [loading, setLoading] = useState(true);

  // 🛒 Fetch Cart on Load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/cart`);
        setCart(res.data.cart || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // 💰 Calculate Total
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // 🧾 Checkout
  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/checkout`, {
        ...form,
        cartItems: cart,
      });
      setMessage(res.data.message);
      setReceipt(res.data.receipt);
      setCart([]); // clear cart
    } catch (err) {
      console.error("Checkout error:", err);
      setMessage(err.response?.data?.message || "Something went wrong!");
    }
  };

  // ❌ Remove Item (Instant UI Update)
  const handleRemove = async (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id)); // instant update
    try {
      await axios.delete(`${API_URL}/api/cart/${id}`);
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // 🧱 UI
  return (
    <div className="cart-container">
      <h2>🛒 Your Cart</h2>

      {loading ? (
        <p>Loading cart...</p>
      ) : cart.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <span>
                <strong>{item.name}</strong> - ₹{item.price} × {item.qty}
              </span>
              <button onClick={() => handleRemove(item._id)}>
                Remove
              </button>
            </div>
          ))}

          <h3 className="cart-total">Total: ₹{total}</h3>

          {/* Checkout Form */}
          <form onSubmit={handleCheckout} className="checkout-form">
            <input
              type="text"
              placeholder="Your Name"
              value={form.Name}
              onChange={(e) => setForm({ ...form, Name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <button type="submit">Place Order</button>
          </form>
        </>
      )}

      {/* 🧾 Receipt Modal */}
      {receipt && (
        <div className="receipt-modal">
          <h3>🧾 Receipt</h3>
          <p>
            <strong>Name:</strong> {receipt.Name}
          </p>
          <p>
            <strong>Email:</strong> {receipt.email}
          </p>
          <p>
            <strong>Total:</strong> ₹{receipt.total}
          </p>
          <p>
            <strong>Date:</strong> {receipt.timestamp}
          </p>
          <button onClick={() => setReceipt(null)}>Close</button>
        </div>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Cart;
