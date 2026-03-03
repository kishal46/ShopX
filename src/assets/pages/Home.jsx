import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import HeroSection from "../components/HeroSection";
import TrendingSection from "../components/TrendingSection";
import BrandSlider from "../components/BrandSlider";

import "./Home.css";
import Header from "../components/Header";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Home = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const res = await axios.get(`${API}/api/products`);
      const data = res.data;

      setNewProducts(data.slice(-6));
      setBestSellers(data.slice(0, 6));
      setCategories([...new Set(data.map((p) => p.category))]);
    } catch (err) {
      console.error("Home Load Error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="home-body">

      <Header/>
      <HeroSection />

      {/* FEATURE BOXES */}
      <section className="container home-section mt-5">
        <div className="row g-3 text-center mt-5">
          {[
            ["🚚", "Fast Delivery"],
            ["💳", "Secure Payment"],
            ["⭐", "Premium Quality"],
            ["📞", "24/7 Support"],
          ].map(([icon, text], i) => (
            <div className="col-6 col-md-3" key={i}>
              <div className="feature-box">
                <h1>{icon}</h1>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="container home-section mt-5">
        <h3 className="section-title mt-5">NEW ARRIVALS</h3>

        <div className="row g-3">
          {newProducts.map((p) => (
            <div
              className="col-6 col-md-4 col-lg-2"
              key={p._id}
              onClick={() => navigate(`/shop?highlight=${p._id}`)}
            >
              <div className="product-card">
                <img src={p.image} alt={p.name} className="product-img" />
                <p className="product-name">{p.name}</p>
                <p className="product-price">₹{p.discountPrice || p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <BrandSlider />
      <section className="newsletter">
        <h2>JOIN OUR NEWSLETTER</h2>
        <p>Stay updated with offers & new arrivals.</p>
        <div className="newsletter-box">
          <input type="email" placeholder="Enter your email..." />
          <button>Subscribe</button>
        </div>
      </section>
    </div>
  );
};

export default Home;
