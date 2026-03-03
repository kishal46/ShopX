import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";
import "./HeroSection.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const HeroSection = () => {
  const [banners, setBanners] = useState([]);

  /* ⭐ TEXT CONFIG BASED ON INDEX */
  const bannerContent = [
    {
      tag: "⭐ New Arrivals",
      title: "Discover Amazing Deals",
      subtitle: "Latest products just arrived",
    },
    {
      tag: "🔥 Offers",
      title: "Biggest Sale Today",
      subtitle: "Up to 70% off on selected items",
    },
    {
      tag: "🚀 Trending",
      title: "Top Trending Products",
      subtitle: "Most popular items this week",
    },
  ];

  /* ================= LOAD HERO IMAGES ================= */
  useEffect(() => {
    const loadHero = async () => {
      try {
        const res = await axios.get(`${API}/api/hero`);
        setBanners(res.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    loadHero();
  }, []);

  if (!banners.length) return null;

  return (
    <div className="hero-wrapper container-style">
      <Carousel fade interval={3500} indicators>
        {banners.map((img, i) => {
          const content = bannerContent[i % bannerContent.length];

          return (
            <Carousel.Item key={i}>
              <div
                className="hero-slide"
                style={{
                  backgroundImage: `url(${API}/uploads/hero/${img})`,
                }}
              >
                <div className="hero-content">
                  <span className="hero-badge">{content.tag}</span>
                  <h1>{content.title}</h1>
                  <p>{content.subtitle}</p>

                  <button>Shop Now</button>
                </div>
              </div>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </div>
  );
};

export default HeroSection;
