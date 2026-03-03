import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // ✅ AUTH IMPORT
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import PageTopBar from "../components/PageTopBar";
import "./Shop.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Shop = () => {
  const { addToCart } = useCart();
  const { user } = useAuth(); // ✅ GET USER
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    maxPrice: "",
  });
  const [quantities, setQuantities] = useState({});

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await axios.get(`${API}/api/products`);
        const data = res.data;

        setProducts(data);
        setFiltered(data);

        setCategories([
          ...new Set(data.map((p) => p.category || "Uncategorized")),
        ]);

        const q = {};
        data.forEach((p) => (q[p._id] = 1));
        setQuantities(q);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load products");
      }
    };

    loadProducts();
  }, []);

  /* ================= FILTER ================= */
  useEffect(() => {
    let result = [...products];

    if (filters.search)
      result = result.filter((p) =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );

    if (filters.category)
      result = result.filter((p) => p.category === filters.category);

    if (filters.maxPrice)
      result = result.filter(
        (p) => (p.discountPrice || p.price) <= Number(filters.maxPrice)
      );

    setFiltered(result);
  }, [filters, products]);

  /* ================= DISCOUNT CALC ================= */
  const discountPercent = (p) => {
    if (!p.discountPrice || !p.price) return null;
    return Math.round(100 - (p.discountPrice / p.price) * 100);
  };

  const inc = (id) =>
    setQuantities((q) => ({ ...q, [id]: (q[id] || 1) + 1 }));

  const dec = (id) =>
    setQuantities((q) => ({
      ...q,
      [id]: Math.max(1, (q[id] || 1) - 1),
    }));

  /* ================= ADD TO CART (LOGIN PROTECTED) ================= */
  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    // 🚫 If user not logged in → go login
    if (!user) {
      toast.info("Please login to add items 🛒");
      navigate("/login");
      return;
    }

    // ✅ Logged in
    const qty = quantities[product._id] || 1;
    addToCart({ ...product, quantity: qty });

    toast.success("Added to cart 🛒");
    navigate("/cart");
  };

  return (
    <div className="shop-wrapper">
      <Container>
        <PageTopBar />
        <ToastContainer position="top-center" />

        <h2 className="shop-title">Shop Products</h2>

        {/* ================= FILTER BAR ================= */}
        <Row className="filter-bar">
          <Col md={4}>
            <Form.Control
              placeholder="Search..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </Col>

          <Col md={4}>
            <Form.Select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Form.Select>
          </Col>

          <Col md={4}>
            <Form.Control
              type="number"
              placeholder="Max price"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
            />
          </Col>
        </Row>

        {/* ================= PRODUCT GRID ================= */}
        <Row>
          {filtered.map((p) => (
            <Col key={p._id} xs={6} md={3} className="mb-4">
              <Card className="shop-card h-100">
                <Link to={`/product/${p._id}`}>
                  <div className="img-wrap">
                    <img src={p.image} alt={p.name} />
                  </div>
                </Link>

                <Card.Body className="card-body-custom">
                  <Link to={`/product/${p._id}`} className="title-link">
                    {p.name}
                  </Link>

                  {/* ⭐ PRICE + OFF */}
                  <div className="price">
                    {p.discountPrice ? (
                      <>
                        <span className="new-price">
                          ₹{p.discountPrice}
                        </span>

                        <span className="old-price">
                          ₹{p.price}
                        </span>

                        <span className="off-badge">
                          {discountPercent(p)}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="new-price">
                        ₹{p.price}
                      </span>
                    )}
                  </div>

                  <div className="qty-box">
                    <Button size="sm" onClick={() => dec(p._id)}>–</Button>
                    <span>{quantities[p._id] || 1}</span>
                    <Button size="sm" onClick={() => inc(p._id)}>+</Button>
                  </div>

                  {/* ✅ LOGIN PROTECTED BUTTON */}
                  <Button
                    className="add-btn"
                    onClick={(e) => handleAddToCart(e, p)}
                  >
                    <ShoppingCart size={14} />
                    {user ? " Add" : " Login to Buy"}
                  </Button>

                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Shop;
