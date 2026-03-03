import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Trending.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const TrendingSection = () => {
  const [trending, setTrending] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/api/trending`).then(res => {
      setTrending(res.data);
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || trending.length < 4) return;

    const interval = setInterval(() => {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 220, behavior: "smooth" });
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [trending]);

  if (!trending.length) return null;

  return (
    <section className="trending-section">
      <h3 className="trending-title">🔥 Trending</h3>

      <div className="trending-row" ref={scrollRef}>
        {trending.map((t) => {
          const p = t.productId;
          return (
            <div
              key={t._id}
              className="trending-card"
              onClick={() => navigate(`/shop?highlight=${p._id}`)}
            >
              <img src={p?.image} alt={p?.name} />
              <div className="info">
                <p className="name">{p?.name}</p>
                <p className="price">
                  ₹{p?.discountPrice || p?.price}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrendingSection;
