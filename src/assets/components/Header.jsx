import { Nav, NavDropdown, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Header = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const searchRef = useRef(null);

  const isAdmin =
    user?.role === "admin" || user?.name?.toLowerCase() === "admin";

  /* ================= DEBOUNCE SEARCH ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  /* ================= LIVE SEARCH ================= */
  useEffect(() => {
    if (debouncedSearch.trim() === "") {
      setResults([]);
      return;
    }

    const loadProducts = async () => {
      try {
        const res = await axios.get(`${API}/api/products`);
        const filtered = res.data.filter((p) =>
          p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
        setResults(filtered.slice(0, 6));
      } catch (err) {
        console.log(err);
      }
    };

    loadProducts();
  }, [debouncedSearch]);

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="shop-header">
      <Container className="header-inner">

        {/* LEFT */}
        <div className="header-left">
          <LinkContainer to="/">
            <h3
              className="logo"
              style={{ cursor: "pointer", marginBottom: 0 }}
            >
              ShopX
            </h3>
          </LinkContainer>

          <Nav className="header-menu">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/shop">
              <Nav.Link>Shop</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/contact">
              <Nav.Link>Contact</Nav.Link>
            </LinkContainer>
          </Nav>
        </div>

        {/* SEARCH */}
        <div className="header-search" ref={searchRef}>
          <input
            placeholder="Search products, brands..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowPopup(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/shop?search=${search}`);
                setShowPopup(false);
              }
            }}
          />

          <button
            className="search-btn"
            onClick={() => navigate(`/shop?search=${search}`)}
          >
            ➜
          </button>

          {showPopup && results.length > 0 && (
            <div className="search-popup">
              {results.map((p) => (
                <div
                  key={p._id}
                  className="search-item"
                  onClick={() => {
                    navigate(`/product/${p._id}`);
                    setSearch("");
                    setShowPopup(false);
                  }}
                >
                  <img src={p.image} alt={p.name} />
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="header-right">
          {!isAdmin && (
            <LinkContainer to="/cart">
              <span className="cart-link" style={{ cursor: "pointer" }}>
                🛒
                {itemCount > 0 && (
                  <span className="cart-pill">{itemCount}</span>
                )}
              </span>
            </LinkContainer>
          )}

          {user ? (
            <NavDropdown title={user.name} align="end">

              {/* ⭐ USER ORDERS */}
              {!isAdmin && (
                <LinkContainer to="/orders">
                  <NavDropdown.Item>My Orders</NavDropdown.Item>
                </LinkContainer>
              )}

              {/* ⭐ ADMIN PANEL */}
              {isAdmin && (
                <LinkContainer to="/admin/add-product">
                  <NavDropdown.Item>Add Product</NavDropdown.Item>
                </LinkContainer>
              )}

              {isAdmin && (
                <LinkContainer to="/admin/manage-products">
                  <NavDropdown.Item>Manage Products</NavDropdown.Item>
                </LinkContainer>
              )}

              {isAdmin && (
                <LinkContainer to="/admin/hero">
                  <NavDropdown.Item>Hero Manager</NavDropdown.Item>
                </LinkContainer>
              )}

              <NavDropdown.Divider />

              <NavDropdown.Item
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </NavDropdown.Item>

            </NavDropdown>
          ) : (
            <NavDropdown title="Account" align="end">
              <LinkContainer to="/login">
                <NavDropdown.Item>Login</NavDropdown.Item>
              </LinkContainer>

              <LinkContainer to="/signup">
                <NavDropdown.Item>Sign Up</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
          )}
        </div>

      </Container>
    </div>
  );
};

export default Header;
