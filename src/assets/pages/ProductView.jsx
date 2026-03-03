import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import PageTopBar from "../components/PageTopBar";
import { toast } from "react-toastify";
import "./ProductView.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    const loadProduct = async () => {
      try {
        // ⭐ Load selected product
        const res = await axios.get(`${API}/api/products/${id}`);
        setProduct(res.data);

        // ⭐ Load same category products
        const all = await axios.get(`${API}/api/products`);

        const same = all.data.filter(
          (p) =>
            p.category === res.data.category &&
            p._id !== res.data._id
        );

        setRelated(same.slice(0, 6));
      } catch (err) {
        console.log("❌ Product load failed", err);
      }
    };

    loadProduct();
  }, [id]);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 });

    toast.success("Added to cart 🛒");

    // ⭐ Navigate after small delay (premium UX)
    setTimeout(() => {
      navigate("/cart");
    }, 700);
  };

  if (!product) {
    return <p className="text-center mt-5">Loading product...</p>;
  }

  return (
    <Container className="product-page">

      <PageTopBar />

      {/* ================= TOP PRODUCT ================= */}
      <Row className="product-box align-items-center">

        {/* IMAGE SIDE */}
        <Col md={6}>
          <div className="product-image-wrap">
            <img
              src={product.image}
              alt={product.name}
              className="product-img"
            />
          </div>
        </Col>

        {/* INFO SIDE */}
        <Col md={6} className="product-info">

          <h2 className="product-title">{product.name}</h2>

          <div className="price-tag">
            ₹{product.discountPrice || product.price}

            {product.discountPrice && (
              <span className="old">
                ₹{product.price}
              </span>
            )}
          </div>

          <p className="product-desc">
            {product.description || "Premium quality product."}
          </p>

          <Button
            className="buy-btn"
            onClick={handleAddToCart}
          >
            Add To Cart
          </Button>

        </Col>

      </Row>

      {/* ================= SMALL SIMILAR PRODUCTS ================= */}
      {related.length > 0 && (
        <>
          <h6 className="section-title">Similar Products</h6>

          <Row className="g-3">
            {related.map((p) => (
              <Col key={p._id} xs={6} md={2}>
                <Card
                  className="related-card-small"
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  <div className="rel-img-wrap">
                    <img src={p.image} alt={p.name} />
                  </div>

                  <Card.Body className="p-2 text-center">
                    <small className="rel-title">
                      {p.name}
                    </small>

                    <div className="rel-price">
                      ₹{p.discountPrice || p.price}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

    </Container>
  );
};

export default ProductView;
