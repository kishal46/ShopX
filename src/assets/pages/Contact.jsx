import { useState } from "react";
import { Container, Form, Button, Spinner, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import PageTopBar from "../components/PageTopBar";
import { Phone } from "lucide-react";
import "./Contact.css"
const API = process.env.REACT_APP_API_URL;

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.warn("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API}/api/contact`, form, {
        withCredentials: true,
      });

      if (res.data?.success) {
        toast.success("Message sent successfully ✅");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error(res.data?.message || "Failed to send message");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <PageTopBar />

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={6} md={8}>

            <Card className="contact-card shadow-lg border-0">
              <Card.Body>

                <h2 className="text-center mb-4 fw-bold">
                  <Phone size={24} className="me-2 text-danger" />
                  Contact ShopX
                </h2>

                <Form onSubmit={handleSubmit}>

                  <Form.Control
                    className="mb-3 contact-input"
                    placeholder="Your Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />

                  <Form.Control
                    className="mb-3 contact-input"
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />

                  <Form.Control
                    className="mb-3 contact-input"
                    placeholder="Phone Number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />

                  <Form.Control
                    as="textarea"
                    rows={4}
                    className="mb-4 contact-input"
                    placeholder="Your Message..."
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                  />

                  <Button
                    type="submit"
                    className="w-100 contact-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" animation="border" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>

                </Form>
              </Card.Body>
            </Card>

          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
