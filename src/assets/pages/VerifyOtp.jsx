import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

const VerifyOtp = () => {

  const { orderId } = useParams();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtp = async () => {

    if (otp.length !== 6) {
      toast.warn("Enter 6 digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders/verify-otp`,
        { orderId, otp }
      );

      console.log("VERIFY RESPONSE:", res.data);

      // ⭐ UNIVERSAL SUCCESS CHECK
      if (
        res.data?.success === true ||
        res.data?.status === "success" ||
        res.data?.verified === true
      ) {
        toast.success("✅ Order confirmed successfully!");
        navigate("/orders");
        return;
      }

      // ⭐ IF NOT SUCCESS → WRONG OTP
      toast.error(
        res.data?.message ||
        res.data?.error ||
        "❌ Wrong OTP"
      );

    } catch (err) {

      console.log("VERIFY ERROR:", err?.response?.data);

      // ⭐ Handles 400/401 backend errors
      toast.error(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "❌ Invalid OTP. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="text-center py-5">

      <h3 className="mb-3">Enter OTP to Confirm Your Order</h3>

      <Form.Control
        type="text"
        value={otp}
        maxLength={6}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g,""))}
        onKeyDown={(e)=>{
          if(e.key==="Enter"){
            e.preventDefault();
            verifyOtp();
          }
        }}
        placeholder="Enter 6-digit OTP"
        className="w-50 mx-auto mb-3 text-center"
        style={{fontSize:"20px",fontWeight:"bold"}}
      />

      <Button
        size="sm"
        variant="dark"
        disabled={loading}
        onClick={verifyOtp}
        className="d-inline-flex align-items-center gap-2"
      >
        {loading ? (
          <>
            <Spinner size="sm" animation="border" />
            Verifying...
          </>
        ) : (
          "Confirm Order"
        )}
      </Button>

    </Container>
  );
};

export default VerifyOtp;
