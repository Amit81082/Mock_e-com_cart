import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Products from "./pages/Products.jsx";
import Cart from "./pages/Cart.jsx";
import "./App.css"; // external CSS file

function App() {
  return (
    <Router>
      <nav className="navbar">
        <h2 className="logo">Mock Shop</h2>
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Products
          </Link>
          <span className="divider">|</span>
          <Link to="/cart" className="nav-link">
            Cart
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;

