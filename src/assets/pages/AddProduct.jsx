import { useState } from "react";
import { Container, Form, Button, Spinner, Table } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import PageTopBar from "../components/PageTopBar";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const AddProduct = () => {

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState([]);

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    discountPrice: "",
    image: "",
  });

  const categories = [
    "Fashion",
    "Electronics",
    "Beauty",
    "Home",
    "Mobile",
    "Groceries",
  ];

  // =========================
  // ✅ MANUAL ADD PRODUCT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      product.discountPrice &&
      Number(product.discountPrice) >= Number(product.price)
    ) {
      toast.error("Discount price must be less than actual price");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API}/api/products`, product);

      toast.success("✅ Product added successfully!");

      setProduct({
        name: "",
        category: "",
        price: "",
        discountPrice: "",
        image: "",
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🚀 ULTRA BULK EXCEL IMPORT
  // =========================
  const handleExcelUpload = async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (evt) => {

      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json(worksheet);

      // ⭐ Normalize + Validate
      const formattedProducts = rows
        .map((row) => ({
          name: row.name || row.Name || "",
          category: row.category || row.Category || "",
          price: Number(row.price || row.Price || 0),
          discountPrice: Number(row.discountPrice || row.DiscountPrice || 0),
          image: row.image || row.Image || "",
        }))
        .filter((p) => p.name);

      if (!formattedProducts.length) {
        toast.warn("No valid products found");
        return;
      }

      setPreview(formattedProducts.slice(0,5));

      try {
        setLoading(true);

        // 🚀 FAST BULK REQUESTS
        const requests = formattedProducts.map((p) =>
          axios.post(`${API}/api/products`, p)
        );

        const results = await Promise.allSettled(requests);

        const success = results.filter(r=>r.status==="fulfilled").length;
        const failed = results.filter(r=>r.status==="rejected").length;

        toast.success(`🎉 ${success} added, ❌ ${failed} failed`);

      } catch (err) {
        console.error(err);
        toast.error("Excel import failed");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Container className="py-4">
      <PageTopBar/> 
      <h2 className="mb-4 text-center">Add New Product</h2>
      <Form.Group className="mb-4">
        <Form.Label>Import Products (Excel)</Form.Label>
        <Form.Control
          type="file"
          accept=".xlsx,.xls"
          disabled={loading}
          onChange={handleExcelUpload}
        />
      </Form.Group>

      {/* ⭐ PREVIEW TABLE */}
      {preview.length > 0 && (
        <Table bordered size="sm" className="mb-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {preview.map((p,i)=>(
              <tr key={i}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.price}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select
            value={product.category}
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price (₹)</Form.Label>
          <Form.Control
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Discount Price (₹)</Form.Label>
          <Form.Control
            type="number"
            value={product.discountPrice}
            onChange={(e) => setProduct({ ...product, discountPrice: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            value={product.image}
            onChange={(e) => setProduct({ ...product, image: e.target.value })}
          />
        </Form.Group>

        <Button
          variant="dark"
          type="submit"
          className="w-100 d-flex justify-content-center align-items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" animation="border"/>
              Processing...
            </>
          ) : (
            "Add Product"
          )}
        </Button>

      </Form>
    </Container>
  );
};

export default AddProduct;
