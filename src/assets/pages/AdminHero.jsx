import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Form, Button, Card } from "react-bootstrap";
import PageTopBar from "../components/PageTopBar";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const AdminHero = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);

  const load = async () => {
    try {
      const res = await axios.get(`${API}/api/hero`);
      setImages(res.data);
    } catch (err) {
      console.error("Error loading hero:", err);
    }
  };

  const uploadImage = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("heroImage", file);

    try {
      await axios.post(`${API}/api/hero/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFile(null);
      load();
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const deleteImage = async (index) => {
    try {
      await axios.delete(`${API}/api/hero/${index}`);
      load();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Container className="py-5">

      <PageTopBar/>
      <h3 className="mb-4 fw-bold">Manage Hero Banner</h3>

      <div className="d-flex gap-2 mb-4">
        <Form.Control
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <Button variant="dark" onClick={uploadImage}>
          Upload
        </Button>
      </div>

      <div className="d-flex flex-wrap gap-3">
        {images.map((img, i) => (
          <Card key={i} style={{ width: 230 }} className="shadow-sm border-0">
            <Card.Img
              src={`${API}/uploads/hero/${img}`}
              style={{
                height: 150,
                objectFit: "cover",
                borderRadius: "8px 8px 0 0",
              }}
            />
            <Button
              variant="dark"
              size="sm"
              className="w-100"
              onClick={() => deleteImage(i)}
            >
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default AdminHero;
