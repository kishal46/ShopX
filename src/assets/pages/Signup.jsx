import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import PageTopBar from "../components/PageTopBar";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/register`,
        form,
        { withCredentials: true }
      );

      toast.success(res.data.message || "Signup successful!");

      setForm({ name: "", email: "", password: "" });

      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Signup failed"
      );
    }
  };

  return (
    <div className="container">
      <PageTopBar />

      <Container className="auth-container">
        <h2 className="text-center mb-4">Sign Up</h2>

        <Form onSubmit={handleSubmit} className="auth-form">
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Enter your name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="Enter your email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              placeholder="Enter your password"
              required
            />
          </Form.Group>

          <Button type="submit" variant="dark" className="w-100">
            Register
          </Button>

          <div className="text-center mt-3">
            <span>Already have an account? </span>
            <Link to="/login" className="auth-link">
              Login here
            </Link>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default Signup;
