import { useEffect } from "react";
import "./FlexToast.css";

const FlexToast = ({ type = "success", message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 1800);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`flexToast flexToast-${type}`}>
      {type === "success" && "✅"}
      {type === "error" && "❌"}
      {type === "warn" && "⚠️"}
      &nbsp; {message}
    </div>
  );
};

export default FlexToast;
