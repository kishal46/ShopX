import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Form, Button, Card } from "react-bootstrap";
import PageTopBar from "../components/PageTopBar";


const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const AdminTrending = () => {
  const [products, setProducts] = useState([]);
  const [trending, setTrending] = useState([]);
  const [selected, setSelected] = useState("");

  const loadData = async () => {
    const p = await axios.get(`${API}/api/products`);
    const t = await axios.get(`${API}/api/trending`);
    setProducts(p.data);
    setTrending(t.data);
  };

  const addTrending = async () => {
    if (!selected) return;
    await axios.post(`${API}/api/trending`, { productId: selected });
    setSelected("");
    loadData();
  };

  const remove = async (id) => {
    await axios.delete(`${API}/api/trending/${id}`);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container className="py-4">
      <PageTopBar/>
      <h3 className="fw-bold mb-3">Manage Trending Products</h3>

      {/* Dropdown */}
      <div className="d-flex gap-2 mb-3">
        <Form.Select value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </Form.Select>

        <Button variant="dark" onClick={addTrending}>Add</Button>
      </div>

      {/* Trending List */}
      <div className="d-flex flex-wrap gap-3">
        {trending.map((t) => (
          <Card style={{ width: 200 }} key={t._id}>
            <Card.Img src={t.productId?.image} height={140} style={{ objectFit: "cover" }} />
            <Card.Body>
              <Card.Title>{t.productId?.name}</Card.Title>
              <Button size="sm" variant="dark" className="w-100" onClick={() => remove(t._id)}>
                Remove
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default AdminTrending;
