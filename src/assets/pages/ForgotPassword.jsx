import { useState } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import "./Auth.css";
import PageTopBar from "../components/PageTopBar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/forgot-password`, { email });
      toast.success("Reset link has been sent to your email");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
    setLoading(false);
  };

  return (
    <Container className="auth-container">
      <PageTopBar/>
      <ToastContainer />
      <h2 className="text-center mb-4">Forgot Password</h2>
      <Form onSubmit={submitHandler} className="auth-form">
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="dark" className="w-100" type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Send Reset Link"}
        </Button>

        <div className="text-center mt-3">
          <Link to="/login" className="auth-link">Back to Login</Link>
        </div>
      </Form>
    </Container>
  );
};

export default ForgotPassword;
