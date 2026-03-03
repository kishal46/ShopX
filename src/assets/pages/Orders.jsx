// frontend/Orders.jsx
import { useEffect, useRef, useState } from "react";
import { Container, Card, Button, Form, Table, Image } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import "./MyOrders.css";
import PageTopBar from "../components/PageTopBar";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [cancelReason, setCancelReason] = useState({});
  const [otpBoxes, setOtpBoxes] = useState({});
  const otpRefs = useRef({});

  const fetchOrders = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.email) return;
    try {
      const res = await axios.get(`${API}/api/orders?email=${user.email}`);
      if (res.data.success) setOrders(res.data.orders);
    } catch {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const fmt = (d) => (d ? new Date(d).toLocaleString() : "");
  const ph = "https://via.placeholder.com/60x60.png?text=Item";

  const getOtpString = (orderId) => (otpBoxes[orderId] || []).join("");

  const handleOtpChange = (orderId, index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const arr = otpBoxes[orderId] ? [...otpBoxes[orderId]] : ["", "", "", "", "", ""];
    arr[index] = value;
    setOtpBoxes({ ...otpBoxes, [orderId]: arr });

    if (value && index < 5) {
      otpRefs.current[orderId]?.[index + 1]?.focus();
    }
  };

  const handleOtpKey = (orderId, index, e) => {
    if (e.key === "Backspace" && !((otpBoxes[orderId] || [])[index] || "") && index > 0) {
      otpRefs.current[orderId]?.[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) otpRefs.current[orderId]?.[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) otpRefs.current[orderId]?.[index + 1]?.focus();
  };

  const handleOtpPaste = (orderId, e) => {
    const text = (e.clipboardData || window.clipboardData).getData("text");
    const digits = (text || "").replace(/\D/g, "").slice(0, 6).split("");
    if (!digits.length) return;
    e.preventDefault();
    const arr = ["", "", "", "", "", ""];
    digits.forEach((d, i) => { arr[i] = d; });
    setOtpBoxes({ ...otpBoxes, [orderId]: arr });
    const last = Math.min(digits.length, 6) - 1;
    if (last >= 0) otpRefs.current[orderId]?.[last]?.focus();
  };

  const verifyDeliveryOtp = async (id) => {
    const otp = getOtpString(id);
    if (otp.length !== 6) return toast.warn("Enter 6-digit OTP");
    try {
      setLoading(true);
      const res = await axios.post(`${API}/api/orders/${id}/verify-delivery-otp`, { otp });
      if (res.data.success) {
        toast.success("Order delivered!");
        setOtpBoxes({ ...otpBoxes, [id]: ["", "", "", "", "", ""] });
        fetchOrders();
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendDeliveryOtp = async (id) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API}/api/orders/${id}/resend-delivery-otp`);
      if (res.data.success) toast.success("Delivery OTP resent");
      else toast.error(res.data.message);
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const cancel = async (id) => {
    const reason = (cancelReason[id] || "").trim();
    if (!reason) return toast.warn("Enter cancel reason");
    try {
      setLoading(true);
      const res = await axios.put(`${API}/api/orders/${id}/cancel`, { reason });
      if (res.data.success) {
        toast.success("Order cancelled");
        fetchOrders();
      } else {
        toast.error(res.data.message || "Cancel failed");
      }
    } catch {
      toast.error("Cancel failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">

{/* ✅ SINGLE LINE HEADER */}
<div
  className="d-flex align-items-center mb-4"
  style={{ gap: 14 }}
>
  {/* BACK BUTTON */}
  <button
    onClick={() => window.history.back()}
    style={{
      border: "2px solid #000",
      background: "#fff",
      padding: "6px 14px",
      borderRadius: 20,
      fontWeight: 600,
      cursor: "pointer",
    }}
  >
    ← Back
  </button>

  {/* HOME ICON */}
  <Link to="/" style={{ color: "#000", fontSize: 22 }}>
    <FaHome />
  </Link>

  {/* TITLE */}
  <h2 className="fw-bold m-0">My Orders — ShopX</h2>
</div>

      {orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        orders.map((order) => (
          <Card key={order._id} className="mb-4 shadow-sm" style={{ border: "2px solid #000", borderRadius: 10 }}>
            <Card.Body>

              <div className="d-flex justify-content-between flex-wrap gap-2">
                <div>
                  <h5 className="fw-bold mb-1">Order #{order._id.slice(-6).toUpperCase()}</h5>
                  <small className="text-muted">Placed: {fmt(order.createdAt)}</small>
                </div>
                <div style={{ fontWeight: 800, color: "#000" }}>{order.status}</div>
              </div>

              <div style={{ marginTop: 12 }}>
                {["Pending Confirmation", "Confirmed", "Out for Delivery", "Delivered"].map((s) => (
                  <div key={s} className="d-flex align-items-center mb-1">
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: order.status === s ? "#000" : "#c9c9c9",
                        marginRight: 8,
                      }}
                    />
                    <span style={{ fontWeight: order.status === s ? 700 : 400 }}>{s}</span>
                  </div>
                ))}
              </div>

              <Table bordered size="sm" className="mt-3" style={{ borderColor: "#000" }}>
                <thead style={{ background: "#000", color: "#fff" }}>
                  <tr>
                    <th>Image</th>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price (₹)</th>
                    <th>Subtotal (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((it, i) => (
                    <tr key={i}>
                      <td className="text-center">
                        <Image src={it.image || ph} width={50} height={50} style={{ objectFit: "cover" }} rounded />
                      </td>
                      <td>{it.name}</td>
                      <td>{it.qty}</td>
                      <td>{it.price}</td>
                      <td>{(it.price || 0) * (it.qty || 1)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="fw-bold">Total: ₹{order.total}</div>

            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Orders;