import { useState, useEffect, useRef } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import "./Checkout.css";
import PageTopBar from "../components/PageTopBar";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Checkout = () => {

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [userEmail, setUserEmail] = useState("");

  const [address, setAddress] = useState({
    name:"",
    phone:"",
    line1:"",
    city:"",
    pincode:"",
    country:"India"
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpBoxes, setOtpBoxes] = useState(["","","","","",""]);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  const otpRefs = useRef([]);

  // ==========================
  // LOAD USER + CART
  // ==========================
  useEffect(()=>{

    const savedUser = JSON.parse(localStorage.getItem("user"));
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

    setUserEmail(savedUser?.email || "");
    setCart(savedCart);

    setTotal(
      savedCart.reduce(
        (sum,i)=> sum + (i.price || 0) * (i.quantity || 1),
        0
      )
    );

  },[]);

  const handleAddressChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  const getOtpString = () => otpBoxes.join("");

  // ==========================
  // OTP INPUT CONTROL
  // ==========================
  const handleOtpChange = (idx,val) => {

    if(!/^[0-9]?$/.test(val)) return;

    let arr = [...otpBoxes];
    arr[idx] = val;
    setOtpBoxes(arr);

    if(val && idx<5) otpRefs.current[idx+1].focus();
  };

  const handleOtpBack = (idx,e) => {
    if(e.key==="Backspace" && idx>0 && !otpBoxes[idx])
      otpRefs.current[idx-1].focus();
  };

  const handleOtpEnter = (e) => {
    if(e.key==="Enter"){
      e.preventDefault();
      verifyOtp();
    }
  };

  // ==========================
  // SEND OTP
  // ==========================
  const sendOtp = async () => {

    if(!userEmail) return toast.error("Please login.");
    if(!cart.length) return toast.warn("Cart is empty");

    if(!address.phone || !address.line1 || !address.city || !address.pincode)
      return toast.warn("Fill all address fields");

    try{

      setLoading(true);

      const items = cart.map(i=>({
        name:i.name,
        price:i.price,
        qty:i.quantity || 1,
        image:i.image || ""
      }));

      const payload = {
        email:userEmail,
        items,
        total,
        address
      };

      console.log("API:", API);
      console.log("ORDER PAYLOAD:", payload);

      const res = await axios.post(
        `${API}/api/orders`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("ORDER RESPONSE:", res.data);

      if(res.data?.success){

        setOrderId(res.data.order._id);
        setOtpSent(true);
        toast.success("OTP sent!");

      }else{

        toast.error(res.data?.message || "Order failed");

      }

    }catch(err){

      console.log("ORDER ERROR:", err?.response?.data || err.message);

      toast.error(
        err?.response?.data?.message ||
        "Failed to create order"
      );

    }
    finally{
      setLoading(false);
    }
  };

  // ==========================
  // VERIFY OTP
  // ==========================
  const verifyOtp = async () => {

    const finalOtp = getOtpString();

    if(finalOtp.length !== 6){
      toast.warn("Enter 6 digit OTP");
      return;
    }

    try{

      setLoading(true);

      const res = await axios.post(
        `${API}/api/orders/${orderId}/verify-checkout`,
        { otp: finalOtp },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("VERIFY RESPONSE:", res.data);

      if(res.data?.success){

        toast.success("Order Confirmed!");
        localStorage.removeItem("cart");

        setTimeout(()=>{
          window.location.href="/orders";
        },1000);

      }else{

        toast.error(res.data?.message || "Wrong OTP");

      }

    }catch(err){

      console.log("VERIFY ERROR:", err?.response?.data || err.message);

      toast.error(
        err?.response?.data?.message ||
        "Invalid OTP"
      );

    }finally{
      setLoading(false);
    }
  };

  // ==========================
  // UI
  // ==========================
  return(
    <Container className="py-4">

      <PageTopBar/>

      <h2 className="text-center mb-3">Checkout</h2>

      <Form style={{maxWidth:600}} className="mx-auto">

        <Form.Control className="mb-2" value={userEmail} readOnly />

        <Form.Control className="mb-2" name="name" value={address.name} onChange={handleAddressChange} placeholder="Name"/>
        <Form.Control className="mb-2" name="phone" value={address.phone} onChange={handleAddressChange} placeholder="Phone"/>
        <Form.Control className="mb-2" name="line1" value={address.line1} onChange={handleAddressChange} placeholder="Address"/>
        <Form.Control className="mb-2" name="city" value={address.city} onChange={handleAddressChange} placeholder="City"/>
        <Form.Control className="mb-2" name="pincode" value={address.pincode} onChange={handleAddressChange} placeholder="Pincode"/>

        <h5 className="text-center">Total: ₹{total}</h5>

        {!otpSent && (
          <Button
            className="mt-3 w-100 d-flex justify-content-center align-items-center gap-2"
            variant="dark"
            disabled={loading}
            onClick={sendOtp}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm"/>
                Sending OTP...
              </>
            ) : (
              "Generate OTP & Place Order"
            )}
          </Button>
        )}

        {otpSent && (
        <>
          <div className="mt-3 fw-bold text-center">Enter OTP</div>

          <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:8}}>
            {Array.from({length:6}).map((_,i)=>(
              <input
                key={i}
                ref={el=>otpRefs.current[i]=el}
                maxLength={1}
                value={otpBoxes[i]}
                onKeyDown={(e)=>{
                  handleOtpBack(i,e);
                  handleOtpEnter(e);
                }}
                onChange={(e)=>handleOtpChange(i,e.target.value)}
                style={{
                  width:40,
                  height:50,
                  border:"2px solid #000",
                  borderRadius:6,
                  fontSize:22,
                  fontWeight:700,
                  textAlign:"center"
                }}
              />
            ))}
          </div>

          <Button
            size="sm"
            className="mt-3 w-100 d-flex justify-content-center align-items-center gap-2"
            disabled={loading}
            onClick={verifyOtp}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm"/>
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </>
        )}

      </Form>

    </Container>
  );
};

export default Checkout;
