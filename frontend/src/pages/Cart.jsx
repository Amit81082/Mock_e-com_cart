import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Cart.css"; // external CSS file
const API_URL = import.meta.env.VITE_API_URL;

function Cart() {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [form, setForm] = useState({ Name: "", email: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/cart`)
      .then((res) => setCart(res.data.cart || [])) // fallback empty array
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const total = Array.isArray(cart)
    ? cart.reduce((sum, item) => sum + item.price * item.qty, 0)
    : 0;

  // 🧾 Checkout function
  const handleCheckout = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/api/checkout`, { ...form, cartItems: cart })
      .then((res) => {
        setMessage(res.data.message);
        setReceipt(res.data.receipt);
        setCart([]); // Clear cart on frontend
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || "Something went wrong!");
      });
  };

  // ❌ Remove item function
  const handleRemove = (id) => {
    axios
      .delete(`${API_URL}/api/cart/${id}`)
      .then((res) => setCart(res.data.cart || [])) // backend returns updated cart
      .catch((err) => console.error(err));
  };

  return (
    <div className="cart-container">
      <h2>🛒 Your Cart</h2>

      {loading ? (
        <p>Loading cart...</p>
      ) : cart.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.productId} className="cart-item">
              <span>
                <strong>{item.name}</strong> - &#8377;{item.price} x {item.qty}
              </span>
              {/* ❌ Remove Button */}
              <button onClick={() => handleRemove(item.productId)}>
                Remove
              </button>
            </div>
          ))}

          <h3 className="cart-total">Total: &#8377;{total}</h3>

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
        </div>
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
            <strong>Total:</strong> &#8377;{receipt.total}
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
