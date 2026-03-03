import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import "./Auth.css";
import PageTopBar from "../components/PageTopBar";

const Login = () => {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        form
      );

      const { user, token, message } = res.data;

      if (user) {
        login(user, token);
        toast.success(message || `Welcome back, ${user.name || "User"}!`);
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error("Login failed — user data not found.");
      }

      setForm({ identifier: "", password: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="container">
    <PageTopBar/>
    <Container className="auth-container">
      
      <ToastContainer />
      <h2 className="text-center mb-3">Login</h2>

      <Form onSubmit={handleSubmit} className="auth-form">
        {/* EMAIL / NAME */}
        <Form.Group className="mb-2">
          <Form.Label>Email or Name</Form.Label>
          <Form.Control
            type="text"
            value={form.identifier}
            onChange={(e) =>
              setForm({ ...form, identifier: e.target.value })
            }
            placeholder="Enter your email or name"
            required
          />
        </Form.Group>

        {/* PASSWORD WITH EYE TOGGLE */}
        <Form.Group className="mb-2 position-relative">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            placeholder="Enter your password"
            required
          />

          {/* Eye Toggle */}
          <span
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </Form.Group>

        {/* LOGIN BUTTON */}
        <Button type="submit" variant="dark" className="w-100">
          Login
        </Button>

        {/* Forgot password */}
        <div className="text-center mt-2">
          <Link to="/forgot-password" className="auth-link">
            Forgot Password?
          </Link>
        </div>

        {/* Sign up */}
        <div className="text-center mt-2">
          <span>Don’t have an account? </span>
          <Link to="/signup" className="auth-link">
            Sign up here
          </Link>
        </div>
      </Form>
    </Container>
    </div>  
  );
};

export default Login;
