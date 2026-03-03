import { useNavigate } from "react-router-dom";
import "./PageTopBar.css";

const PageTopBar = ({ showBack = true, showHome = true }) => {
  const navigate = useNavigate();

  return (
    <div className="page-topbar">

      {/* LEFT SIDE */}
      <div className="topbar-left">

        {showBack && (
          <button
            className="topbar-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        )}

      </div>

    </div>
  );
};

export default PageTopBar;
